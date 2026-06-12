//controladores de equipos: leen la request, llaman al service y arman la respuesta
const teamsService = require("../services/teams.service");

//GET /api/equipos?page=1&limit=8&search=boca
const getTeams = async (req, res) => {
  try {
    //page por defecto 1, limit por defecto 8; se ignoran valores invalidos o negativos
    const parsedPage = parseInt(req.query.page, 10);
    const parsedLimit = parseInt(req.query.limit, 10);
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const teams = await teamsService.getTeams({ page, limit, search });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error obteniendo equipos:", error);
    res.status(500).json({ error: "Error inesperado del servidor" });
  }
};
const getTeamById = async (req, res) => {
  const id = req.params.id;
  const team = await teamsService.getTeamById(id);

  if (!team) {
    return res.status(404).json({
      error: "Recurso no encontrado"
    });
  }

  return res.status(200).json(team);
};

module.exports = { getTeams, getTeamById };
