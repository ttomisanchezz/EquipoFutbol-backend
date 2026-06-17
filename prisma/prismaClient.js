// CLIENTE DE PRISMA
// Este archivo crea una única instancia de PrismaClient.
// PrismaClient es el objeto que usamos para comunicarnos con la base de datos PostgreSQL.
// Ejemplo de uso en services:
// prisma.team.findMany()
// prisma.team.create()
// prisma.team.update()
// prisma.team.delete()

const { PrismaClient } = require("@prisma/client");

// Creamos el cliente de Prisma.
// En Prisma 6 no necesitamos adapter ni configuración extra.
// Prisma lee la conexión desde DATABASE_URL en el archivo .env.
const prisma = new PrismaClient();

// Exportamos la instancia para poder usarla desde los services.
module.exports = prisma;