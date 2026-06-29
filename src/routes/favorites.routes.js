// RUTAS DE FAVORITOS
// Asocia cada endpoint protegido con su controlador.

const { Router } = require("express");
const favoritesController = require("../controllers/favorites.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

// Todas las rutas de favoritos requieren token JWT valido.
router.use(authMiddleware);

// GET /api/favorites -> lista favoritos del usuario logueado
router.get("/", favoritesController.getFavorites);

// POST /api/favorites -> agrega un equipo a favoritos
router.post("/", favoritesController.createFavorite);

// DELETE /api/favorites/:teamId -> elimina un equipo de favoritos
router.delete("/:teamId", favoritesController.deleteFavorite);

module.exports = router;
