const prisma = require("../../prisma/prismaClient");

const getusers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            id: "asc",
        },
    });
}
const getuserId = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        }
    });
}
const getUserEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        }
    });
}
const getUserName = async (name) => {
    return await prisma.user.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
}
// Devuelve los datos públicos del usuario (sin password) por id.
// Lo usa el endpoint /me una vez que el middleware (tarea 5) carga req.user.
const getUserProfile = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
const registerUser = async (data) => {
    return await prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
module.exports = { getusers, getuserId, getUserEmail, getUserName, getUserProfile, registerUser };