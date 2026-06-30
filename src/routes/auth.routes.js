const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = Router();

//GET /api/auth -> listado de los usuarios
router.get("/", authController.getUsers);
//POST /api/auth/register -> ingresar un nuevo usuario
router.post("/register", authController.registerUser);
//POST /api/auth/login -> validar un usuriario 
router.post("/login", authController.loginUser);
//POST /api/auth/logout -> sesion cerrada
router.post("/logout", authController.logout);
//GET /api/auth/me -> devuelve la informacion del usuario logueado (sin contraseña)
//ruta protegida: authMiddleware valida el token antes de llegar al controller
router.get("/me", authMiddleware, authController.me);

module.exports = router;