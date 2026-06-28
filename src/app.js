// CONFIGURACION DE EXPRESS Y LAS RUTAS DE LA API

// Importamos Express para crear la aplicación del backend.
const express = require("express");

// Importamos CORS para permitir que el frontend pueda consumir la API.
const cors = require("cors");

// Importamos las rutas de equipos.
const teamsRoutes = require("./routes/teams.routes");


const authRoutes = require("./routes/auth.routes");
// Creamos la aplicación de Express.
const app = express();

// CONFIGURACION DE CORS
// CORS controla desde qué frontend se permite consumir esta API.
//
// En desarrollo, FRONTEND_URL normalmente será:
// http://localhost:5173
//
// En producción, FRONTEND_URL debería ser la URL del frontend desplegado.
// Ejemplo:
// https://equipofutbol.vercel.app
//
// Si FRONTEND_URL no está definido, usamos localhost:5173 como valor por defecto.
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
    cors({
        origin: frontendUrl,
    })
);

// Permite recibir JSON en el body de las solicitudes.
// Sin esto, req.body vendría undefined en POST y PUT.
app.use(express.json());

// Ruta GET /api/health para verificar que la API está funcionando.
app.get("/api/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "API funcionando correctamente",
    });
});

// Monta las rutas de equipos bajo /api/equipos.
// Ejemplo:
// GET /api/equipos
// POST /api/equipos
// PUT /api/equipos/:id
// DELETE /api/equipos/:id
app.use("/api/equipos", teamsRoutes);

app.use("/api/auth", authRoutes);

// Exporta la app para usarla desde index.js.
module.exports = app;