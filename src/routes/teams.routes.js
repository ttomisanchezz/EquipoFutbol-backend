//rutas de equipos: asocia cada endpoint con su controlador
const { Router } = require("express");
const teamsController = require("../controllers/teams.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

// Las lecturas (GET) son públicas: cualquiera puede ver el listado y el detalle.
//GET /api/equipos -> listado con paginacion y busqueda
router.get("/", teamsController.getTeams);
//GET /api/equipos/:id -> buscar equipo por id
router.get('/:id', teamsController.getTeamById);

// Las escrituras (POST/PUT/DELETE) requieren token JWT válido:
// solo un usuario autenticado puede crear, editar o borrar equipos.
//POST /api/equipos/ -> ingresar un equipo nuevo
router.post('/', authMiddleware, teamsController.createTeam);
//PUT /api/equipos/:id -> actualizar equipo por id
router.put("/:id", authMiddleware, teamsController.updateTeam);
//DELETE /api/equipos/:id -> eliminar equipo por id s
router.delete("/:id", authMiddleware, teamsController.deleteTeam);

module.exports = router;