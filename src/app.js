// CONFIGURACION DE EXPRESS Y LAS RUTAS DE LA API

// Importamos Express para crear la aplicación del backend.
const express = require("express");

// Importamos CORS para permitir que el frontend pueda consumir la API.
const cors = require("cors");

// Importamos las rutas de equipos.
const teamsRoutes = require("./routes/teams.routes");

// Importamos las rutas de favoritos.
const favoritesRoutes = require("./routes/favorites.routes");


const authRoutes = require("./routes/auth.routes");

// Middlewares de manejo de rutas inexistentes (404) y de errores centralizado.
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

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

// Monta las rutas de favoritos bajo /api/favorites.
// Todas estas rutas estan protegidas con JWT desde favorites.routes.
app.use("/api/favorites", favoritesRoutes);

// Si ninguna ruta anterior coincidió, respondemos 404.
app.use(notFound);

// Manejo centralizado de errores. Siempre va al final, después de las rutas.
// Los controllers delegan acá con next(error) en lugar de responder 500 cada uno.
app.use(errorHandler);

// Exporta la app para usarla desde index.js.
module.exports = app;