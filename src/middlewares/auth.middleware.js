// MIDDLEWARE DE AUTENTICACION JWT
// Este middleware protege las rutas privadas de la API.
//
// Funcionamiento:
// 1. Lee el token del header Authorization (formato "Bearer <token>").
// 2. Si no hay token o el formato es inválido, responde 401.
// 3. Verifica la firma y la expiración del token con jwt.verify.
// 4. Si el token es válido, guarda los datos del usuario en req.user
//    y deja pasar la request al controller con next().
// 5. Si el token es inválido o está vencido, responde 401.
//
// Lo usan las rutas que requieren sesión iniciada, como GET /api/auth/me
// y (a partir de la tarea 6) los endpoints de favoritos.

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // El token viaja en el header Authorization con este formato:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const authHeader = req.headers.authorization;

    // Si no vino el header o no empieza con "Bearer ", no hay sesión válida.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "No autorizado: falta el token de autenticación",
        });
    }

    // Separamos la palabra "Bearer" del token real.
    // authHeader = "Bearer <token>" -> split(" ")[1] = "<token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "No autorizado: token no proporcionado",
        });
    }

    try {
        // jwt.verify valida la firma con JWT_SECRET y controla la expiración.
        // Si el token fue alterado o ya venció, lanza una excepción.
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos del usuario en req.user para que los
        // controllers protegidos puedan saber quién está autenticado.
        // El payload se arma en el login (id y email).
        req.user = {
            id: payload.id,
            email: payload.email,
        };

        // Token válido: dejamos pasar la request.
        return next();
    } catch (error) {
        return res.status(401).json({
            error: "No autorizado: token inválido o expirado",
        });
    }
};

module.exports = authMiddleware;
