// MANEJO CENTRALIZADO DE ERRORES
// Express reconoce este middleware como "error handler" porque recibe
// cuatro parámetros (err, req, res, next). Cualquier controller que llame
// a next(error) termina acá, así no repetimos el try/catch + 500 en cada uno.
//
// Se monta al final de app.js, después de todas las rutas.

const errorHandler = (err, req, res, next) => {
    // Log del error real en el servidor (no se expone al cliente).
    console.error("Error no controlado:", err);

    // Si Express ya empezó a enviar la respuesta, delegamos en su manejador.
    if (res.headersSent) {
        return next(err);
    }

    // Errores conocidos de Prisma.
    // P2002 -> violación de restricción única (recurso duplicado).
    if (err.code === "P2002") {
        return res.status(409).json({
            error: "El recurso ya existe",
        });
    }

    // P2025 -> el registro a actualizar/eliminar no existe.
    if (err.code === "P2025") {
        return res.status(404).json({
            error: "Recurso no encontrado",
        });
    }

    // Cualquier otro error inesperado: 500 genérico, sin exponer detalles.
    return res.status(500).json({
        error: "Error inesperado del servidor",
    });
};

module.exports = errorHandler;
