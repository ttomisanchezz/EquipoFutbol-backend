//Crear cliente de Prisma con driver adapter de PostgreSQL (requerido por Prisma 7)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma; 
