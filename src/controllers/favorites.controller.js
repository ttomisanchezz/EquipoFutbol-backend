// CONTROLLER DE FAVORITOS
// El controller recibe la request HTTP,
// llama al service correspondiente y arma la response HTTP.
//
// Todas las rutas de favoritos son privadas.
// El userId sale siempre de req.user.id, que lo carga authMiddleware.

const favoritesService = require("../services/favorites.service");

// FUNCION AUXILIAR PARA PARSEAR EL TEAM ID
// teamId puede venir desde el body o desde la URL.
// Como en Prisma el id del Team es Int, necesitamos convertirlo a numero.
const parseTeamId = (teamIdParam) => {
  if (
    typeof teamIdParam !== "number" &&
    typeof teamIdParam !== "string"
  ) {
    return null;
  }

  if (typeof teamIdParam === "string" && teamIdParam.trim() === "") {
    return null;
  }

  const teamId = Number(teamIdParam);

  // Si no es un numero entero valido o es menor/igual a 0,
  // devolvemos null para que el controller responda 400.
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return null;
  }

  return teamId;
};

// GET /api/favorites
// Lista los favoritos del usuario logueado, incluyendo los datos del equipo.
const getFavorites = async (req, res, next) => {
  try {
    // req.user lo carga el middleware de autenticacion.
    const userId = req.user.id;

    const favorites = await favoritesService.getFavoritesByUserId(userId);

    return res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

// POST /api/favorites
// Agrega un equipo a los favoritos del usuario logueado.
const createFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teamId = parseTeamId(req.body.teamId);

    if (!teamId) {
      return res.status(400).json({
        error: "teamId invalido",
      });
    }

    // Primero validamos que el equipo exista.
    const team = await favoritesService.getTeamById(teamId);

    if (!team) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    // Despues verificamos que no este repetido para este usuario.
    const existingFavorite = await favoritesService.getFavoriteByUserAndTeam(
      userId,
      teamId
    );

    if (existingFavorite) {
      return res.status(409).json({
        error: "Equipo ya agregado a favoritos",
      });
    }

    const favorite = await favoritesService.createFavorite(userId, teamId);

    return res.status(201).json(favorite);
  } catch (error) {
    // El caso duplicado ya se maneja arriba; si igual llega un P2002
    // (carrera), el errorHandler central lo mapea a 409.
    next(error);
  }
};

// DELETE /api/favorites/:teamId
// Elimina el favorito del usuario logueado para un equipo puntual.
const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teamId = parseTeamId(req.params.teamId);

    if (!teamId) {
      return res.status(400).json({
        error: "teamId invalido",
      });
    }

    const existingFavorite = await favoritesService.getFavoriteByUserAndTeam(
      userId,
      teamId
    );

    if (!existingFavorite) {
      return res.status(404).json({
        error: "Favorito no encontrado",
      });
    }

    await favoritesService.deleteFavorite(userId, teamId);

    return res.status(200).json({
      message: "Favorito eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones para conectarlas con las rutas.
module.exports = {
  getFavorites,
  createFavorite,
  deleteFavorite,
};
