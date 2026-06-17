// SERVICE DE EQUIPOS
// Esta capa contiene la lógica de acceso a datos.
// El controller recibe la request y arma la response.
// El service se encarga de hablar con Prisma y la base de datos.

const prisma = require("../../prisma/prismaClient");

// GET lista, con paginado y búsqueda por nombre.
// page = qué página pedimos.
// limit = cuántos equipos por página.
// search = texto para filtrar por nombre.
// Les damos valores por defecto por si el controller no los manda.
const getTeams = async (page = 1, limit = 8, search = "") => {
  // skip calcula cuántos registros nos salteamos.
  // Ejemplo:
  // page = 1, limit = 8 -> skip = 0
  // page = 2, limit = 8 -> skip = 8
  // page = 3, limit = 8 -> skip = 16
  const skip = (page - 1) * limit;

  // Si search tiene texto, armamos un filtro por nombre.
  // Si search viene vacío, no aplicamos filtro.
  const where = search
    ? {
        name: {
          contains: search, // Que el nombre contenga el texto buscado.
          mode: "insensitive", // Sin distinguir mayúsculas y minúsculas.
        },
      }
    : {};

  // findMany = "traeme muchos registros" de la tabla Team.
  // Es equivalente a hacer un SELECT en SQL.
  return await prisma.team.findMany({
    where, // Filtro opcional por nombre.
    skip, // Nos salteamos los registros de las páginas anteriores.
    take: limit, // Tomamos solo la cantidad indicada por limit.
    orderBy: {
      id: "asc", // Ordenamos por id ascendente: 1, 2, 3, 4...
    },
  });
};

// GET un equipo por su id.
const getTeamById = async (id) => {
  // findUnique = "traeme un único registro" buscándolo por un campo único.
  // En este caso buscamos por id, que es único en el modelo Team.
  // Si no existe, Prisma devuelve null.
  // Ese null después lo usa el controller para responder 404.
  return await prisma.team.findUnique({
    where: {
      id,
    },
  });
};

// Buscar un equipo por nombre.
// Esto sirve para evitar crear equipos duplicados en el POST.
const getTeamByName = async (name) => {
  // findFirst busca el primer equipo que coincida con el nombre.
  // Usamos mode: "insensitive" para que "Boca Juniors" y "boca juniors"
  // se consideren el mismo nombre.
  return await prisma.team.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

// POST crear un equipo.
const createTeam = async (data) => {
  // create = "insertá un nuevo registro" en la tabla Team.
  // data es el objeto con los campos del equipo:
  // name, country, league, stadium, founded, coach, etc.
  // No mandamos id porque PostgreSQL lo genera automáticamente.
  return await prisma.team.create({
    data,
  });
};

// PUT modificar un equipo existente.
const updateTeam = async (id, data) => {
  // Primero buscamos si el equipo existe.
  // Esto evita que Prisma tire error si el id no existe.
  const existingTeam = await prisma.team.findUnique({
    where: {
      id,
    },
  });

  // Si no existe, devolvemos null.
  // El controller va a convertir este null en una respuesta 404.
  if (!existingTeam) {
    return null;
  }

  // Si existe, actualizamos el registro con los datos nuevos.
  return await prisma.team.update({
    where: {
      id,
    },
    data,
  });
};

// DELETE borrar un equipo.
const deleteTeam = async (id) => {
  // Primero buscamos si el equipo existe.
  // No hacemos delete directo porque Prisma lanza error si el id no existe.
  const existingTeam = await prisma.team.findUnique({
    where: {
      id,
    },
  });

  // Si no existe, devolvemos null.
  // El controller va a responder 404.
  if (!existingTeam) {
    return null;
  }

  // Si existe, lo borramos de la base.
  return await prisma.team.delete({
    where: {
      id,
    },
  });
};

// Exportamos las funciones para que el controller las pueda usar.
module.exports = {
  getTeams,
  getTeamById,
  getTeamByName,
  createTeam,
  updateTeam,
  deleteTeam,
};