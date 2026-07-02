// MIDDLEWARE 404
// Se ejecuta cuando ninguna ruta anterior coincidió con la request.
// Debe montarse DESPUÉS de todas las rutas y ANTES del errorHandler.

const notFound = (req, res) => {
    return res.status(404).json({
        error: "Ruta no encontrada",
    });
};

module.exports = notFound;
