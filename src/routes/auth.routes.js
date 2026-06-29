//import authMiddleware from "../middlewares/auth.middleware.js";
const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const router = Router();

//GET /api/auth -> listado de los usuarios
router.get("/", authController.getUsers);
//POST /api/auth/register -> ingresar un nuevo usuario
router.post("/register", authController.registerUser);
//POST /api/auth/login -> validar un usuriario 
router.post("/login", authController.loginUser);
//POST /api/auth/logout -> sesion cerrada
router.post("/logout", authController.logout);
//POST /api/auth/me -> devuelve informacion sin contraseña
// falta  authMiddleware (tarea 5)
router.get("/me", /*authMiddleware,*/ authController.me);

module.exports = router;