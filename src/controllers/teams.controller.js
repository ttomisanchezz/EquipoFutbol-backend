// CONTROLLER DE EQUIPOS
// El controller es la capa que recibe la request HTTP,
// llama al service correspondiente y arma la response HTTP.
//
// Flujo general:
// request -> route -> controller -> service -> Prisma -> PostgreSQL -> response

const teamsService = require("../services/teams.service");
const { validateTeam } = require("../validations/team.validation");

// FUNCION AUXILIAR PARA PARSEAR EL ID
// req.params.id siempre llega como texto porque viene desde la URL.
// Ejemplo: /api/equipos/5 -> req.params.id = "5"
// Como en Prisma el id del Team es Int, necesitamos convertirlo a número.
const parseTeamId = (idParam) => {
  const id = parseInt(idParam, 10);

  // Si no es un número entero válido o es menor/igual a 0,
  // devolvemos null para que el controller responda 400.
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

// GET /api/equipos?page=1&limit=8&search=boca
// Lista equipos con paginado y búsqueda opcional por nombre.
const getTeams = async (req, res, next) => {
  try {
    // req.query son los parámetros que vienen después del "?" en la URL.
    // Ejemplo: /api/equipos?page=2&limit=8&search=boca

    const parsedPage = parseInt(req.query.page, 10);
    const parsedLimit = parseInt(req.query.limit, 10);

    // Si page no viene, no es número o es menor a 1, usamos page = 1.
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    // Si limit no viene, no es número o es menor a 1, usamos limit = 8.
    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;

    // Si search viene como string, le sacamos espacios al principio/final.
    // Si no viene, usamos string vacío.
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    // Llamamos al service, que se encarga de consultar la base con Prisma.
    const teams = await teamsService.getTeams(page, limit, search);

    // 200 = OK. La consulta salió bien.
    return res.status(200).json(teams);
  } catch (error) {
    // Delegamos el error al middleware centralizado (errorHandler).
    next(error);
  }
};

// GET /api/equipos/:id
// Devuelve un equipo puntual por id.
const getTeamById = async (req, res, next) => {
  try {
    // Convertimos el id de string a number.
    const id = parseTeamId(req.params.id);

    // Si el id no es válido, es un error del cliente.
    // Ejemplo: /api/equipos/abc
    if (!id) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    // Buscamos el equipo en la base.
    const team = await teamsService.getTeamById(id);

    // Si Prisma devuelve null, significa que no existe.
    if (!team) {
      return res.status(404).json({
        error: "Recurso no encontrado",
      });
    }

    // Si existe, lo devolvemos.
    return res.status(200).json(team);
  } catch (error) {
    next(error);
  }
};

// POST /api/equipos
// Crea un equipo nuevo.
const createTeam = async (req, res, next) => {
  try {
    // Primero validamos el body antes de consultar o modificar la base.
    const validation = validateTeam(req.body);

    // Si el body no cumple las reglas, respondemos 400.
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: validation.errors,
      });
    }

    // Verificamos si ya existe un equipo con el mismo nombre.
    // Esto evita duplicados tipo "Boca Juniors" y "boca juniors".
    const existingTeam = await teamsService.getTeamByName(req.body.name);

    if (existingTeam) {
      return res.status(409).json({
        error: "Equipo ya ingresado",
      });
    }

    // Armamos un objeto limpio con los campos que acepta el schema.prisma.
    // No incluimos id, createdAt ni updatedAt porque Prisma los maneja automáticamente.
    const teamData = {
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      shortDescription: req.body.shortDescription.trim(),
      description: req.body.description.trim(),
      country: req.body.country.trim(),
      league: req.body.league.trim(),
      stadium: req.body.stadium.trim(),
      founded: Number(req.body.founded),
      coach: req.body.coach.trim(),
      titles: Number(req.body.titles),

      // logo e image son opcionales.
      // Si no vienen, guardamos null.
      logo: req.body.logo || null,
      image: req.body.image || null,
    };

    // Creamos el equipo en la base.
    const newTeam = await teamsService.createTeam(teamData);

    // 201 = Created. Es el código correcto para POST exitoso.
    return res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};

// PUT /api/equipos/:id
// Actualiza un equipo existente.
const updateTeam = async (req, res, next) => {
  try {
    // Convertimos y validamos el id de la URL.
    const id = parseTeamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    // Validamos el body igual que en el POST.
    const validation = validateTeam(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: validation.errors,
      });
    }

    // Armamos un objeto limpio con los datos actualizados.
    const teamData = {
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      shortDescription: req.body.shortDescription.trim(),
      description: req.body.description.trim(),
      country: req.body.country.trim(),
      league: req.body.league.trim(),
      stadium: req.body.stadium.trim(),
      founded: Number(req.body.founded),
      coach: req.body.coach.trim(),
      titles: Number(req.body.titles),
      logo: req.body.logo || null,
      image: req.body.image || null,
    };

    // El service devuelve null si el equipo no existe.
    const updatedTeam = await teamsService.updateTeam(id, teamData);

    if (!updatedTeam) {
      return res.status(404).json({
        error: "Recurso no encontrado",
      });
    }

    // 200 = OK. PUT exitoso.
    return res.status(200).json(updatedTeam);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/equipos/:id
// Elimina un equipo existente.
const deleteTeam = async (req, res, next) => {
  try {
    // Convertimos y validamos el id.
    const id = parseTeamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    // El service devuelve null si el equipo no existe.
    const deletedTeam = await teamsService.deleteTeam(id);

    if (!deletedTeam) {
      return res.status(404).json({
        error: "Recurso no encontrado",
      });
    }

    // 200 = OK. También sería válido responder 204 sin body,
    // pero usamos 200 con mensaje para que sea más claro en Postman.
    return res.status(200).json({
      message: "Equipo eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones para conectarlas con las rutas.
module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};