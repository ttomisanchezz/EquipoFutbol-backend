const authService = require("../services/auth.service");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) =>{
    try{
        const users = await authService.getusers();
        return res.status(200).json(users);
    }catch (error) {
        console.error("Error obteniendo usuarios:", error);

        return res.status(500).json({
            error: "Error inesperado del servidor",
        });
    }
}
const registerUser = async (req, res) =>{
    try {
        const { name, email, password } = req.body;
        const emailValidate = await authService.getUserEmail(email.trim());
        if (emailValidate) {
            return res.status(409).json({
                error: "Email ya ingresado",
            });
        }
        const nameValidate = await authService.getUserName(name.trim());
        if (nameValidate) {
            return res.status(409).json({
                error: "Nombre ya ingresado",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await authService.registerUser({name, email, password: hashedPassword,});
        
        return res.status(201).json(newUser);
    } catch(error){
        console.error("Error creando usuario:", error);

        return res.status(500).json({
            error: "Error inesperado del servidor",
        });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email y contraseña son obligatorios",
            });
        }
        const user = await authService.getUserEmail(email.trim());
        if (!user) {
            return res.status(401).json({
                error: "Email o contraseña incorrectos",
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: "Email o contraseña incorrectos",
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Error validando al usuario:", error);

        return res.status(500).json({
            error: "Error inesperado del servidor",
        });
    }
};

const logout = async (req, res) =>{
    res.status(200).json({
        message: "Sesión cerrada correctamente",
    });
}

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error obteniendo usuario:", error);

        return res.status(500).json({
            error: "Error inesperado del servidor",
        });
    }
};
module.exports = {getUsers, registerUser,loginUser, logout, me};