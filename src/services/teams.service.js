//logica de acceso a datos de equipos usando Prisma
const prisma = require("../prisma/prismaClient");

//obtiene equipos desde PostgreSQL con paginacion y busqueda por nombre
const getTeams = async ({ page, limit, search }) => {
  //si hay termino de busqueda, filtra por nombre sin distinguir mayusculas
  const where = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  return prisma.team.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: "asc" },
  });
};
const getTeamById = async (id) => {
  return prisma.team.findUnique({
    where: {
      id
      /**si el model Team cambia a int @id @default(autoincrement())
       * o valor numerico manual en el seed, cambiar a:
       * id: Number(id),
       */
    }
  });
};

module.exports = { getTeams , getTeamById};
