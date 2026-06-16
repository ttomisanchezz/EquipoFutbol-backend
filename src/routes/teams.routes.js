//rutas de equipos: asocia cada endpoint con su controlador
const { Router } = require("express");
const teamsController = require("../controllers/teams.controller");

const router = Router();

//GET /api/equipos -> listado con paginacion y busqueda
router.get("/", teamsController.getTeams);
router.get('/:id', teamsController.getTeamById);
router.post('/', teamsController.createTeam);
router.put("/:id", teamsController.updateTeam);

module.exports = router;
