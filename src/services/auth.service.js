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
    return await prisma.team.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
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
module.exports = { getusers, getuserId, getUserEmail, getUserName, registerUser };