// SERVICE DE FAVORITOS
// Esta capa contiene la logica de acceso a datos para los favoritos.
// El controller recibe la request y arma la response.
// El service se encarga de hablar con Prisma y la base de datos.

const prisma = require("../../prisma/prismaClient");

// GET lista los favoritos de un usuario, incluyendo los datos del equipo.
const getFavoritesByUserId = async (userId) => {
  return await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Busca un equipo por id para validar que exista antes de crear el favorito.
const getTeamById = async (teamId) => {
  return await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });
};

// Busca si un usuario ya tiene guardado un equipo como favorito.
const getFavoriteByUserAndTeam = async (userId, teamId) => {
  return await prisma.favorite.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
    include: {
      team: true,
    },
  });
};

// POST crea un favorito nuevo para el usuario logueado.
const createFavorite = async (userId, teamId) => {
  return await prisma.favorite.create({
    data: {
      userId,
      teamId,
    },
    include: {
      team: true,
    },
  });
};

// DELETE elimina el favorito de un usuario para un equipo puntual.
const deleteFavorite = async (userId, teamId) => {
  return await prisma.favorite.delete({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });
};

// Exportamos las funciones para que el controller las pueda usar.
module.exports = {
  getFavoritesByUserId,
  getTeamById,
  getFavoriteByUserAndTeam,
  createFavorite,
  deleteFavorite,
};
