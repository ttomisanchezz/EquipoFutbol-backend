// VALIDACION MANUAL DEL BODY DE EQUIPOS
// Esta función valida los datos que llegan en POST y PUT.
// No usamos librerías externas porque la consigna pide validación manual.
//
// La función devuelve un objeto con esta forma:
// {
//     isValid: true o false,
//     errors: []
// }
//
// Si errors está vacío, el body es válido.
// Si errors tiene elementos, el controller responde 400.

const validateTeam = (data) => {
    // Acá acumulamos todos los errores encontrados.
    const errors = [];

    // CHEQUEO 0: validar que el body exista y sea un objeto válido.
    //
    // !data -> no vino nada.
    // typeof data !== "object" -> no es un objeto.
    // Array.isArray(data) -> vino un array en vez de un objeto.
    // Object.keys(data).length === 0 -> vino un objeto vacío: {}.
    if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
        errors.push({
            field: "body",
            message: "El body no puede estar vacío.",
        });

        // Si el body completo está mal, cortamos acá.
        // No tiene sentido seguir validando campo por campo.
        return {
            isValid: false,
            errors,
        };
    }

    // CHEQUEO 1: campos de texto obligatorios.
    // Cada posición del array tiene:
    // [nombreDelCampo, textoParaElMensaje]
    //
    // Así evitamos repetir el mismo if muchas veces.
    const requiredStrings = [
        ["name", "El nombre"],
        ["category", "La categoría"],
        ["shortDescription", "La descripción corta"],
        ["description", "La descripción"],
        ["country", "El país"],
        ["league", "La liga"],
        ["stadium", "El estadio"],
        ["coach", "El entrenador"],
    ];

    // Recorremos cada campo obligatorio de texto.
    for (const [field, label] of requiredStrings) {
        // Falla si:
        // - el campo no existe,
        // - no es string,
        // - o es un string vacío / solo espacios.
        if (!data[field] || typeof data[field] !== "string" || data[field].trim() === "") {
            errors.push({
                field,
                message: `${label} es obligatorio y no puede estar vacío.`,
            });
        }
    }

    // CHEQUEO 2: año de fundación.
    //
    // En Postman o desde el frontend puede llegar como número:
    // founded: 1905
    //
    // O puede llegar como string:
    // founded: "1905"
    //
    // Por eso usamos Number(data.founded) para validar ambos casos.
    if (
        data.founded === undefined ||
        data.founded === null ||
        data.founded === "" ||
        Number.isNaN(Number(data.founded))
    ) {
        errors.push({
            field: "founded",
            message: "El año de fundación debe ser un número válido.",
        });
    } else {
        const foundedNumber = Number(data.founded);
        const currentYear = new Date().getFullYear();

        // Validamos que sea entero.
        // No tendría sentido un año 1905.5.
        if (!Number.isInteger(foundedNumber)) {
            errors.push({
                field: "founded",
                message: "El año de fundación debe ser un número entero.",
            });
        }

        // Validamos que tenga sentido para un club de fútbol.
        if (foundedNumber < 1800 || foundedNumber > currentYear) {
            errors.push({
                field: "founded",
                message: `El año de fundación debe estar entre 1800 y ${currentYear}.`,
            });
        }
    }

    // CHEQUEO 3: cantidad de títulos.
    //
    // También aceptamos que llegue como número o como string numérico.
    // Ejemplo válido:
    // titles: 35
    // titles: "35"
    if (
        data.titles === undefined ||
        data.titles === null ||
        data.titles === "" ||
        Number.isNaN(Number(data.titles))
    ) {
        errors.push({
            field: "titles",
            message: "Los títulos deben ser un número válido.",
        });
    } else {
        const titlesNumber = Number(data.titles);

        // Validamos que sea entero.
        // No tendría sentido tener 3.5 títulos.
        if (!Number.isInteger(titlesNumber)) {
            errors.push({
                field: "titles",
                message: "Los títulos deben ser un número entero.",
            });
        }

        // No tiene sentido una cantidad negativa de títulos.
        if (titlesNumber < 0) {
            errors.push({
                field: "titles",
                message: "Los títulos no pueden ser negativos.",
            });
        }
    }

    // CHEQUEO 4: logo opcional.
    //
    // logo no es obligatorio porque en schema.prisma está como String?.
    // Pero si viene, queremos que tenga formato de ruta local:
    // /logos/nombre.png
    const logoPattern = /^\/logos\/.+$/;

    if (
        data.logo !== undefined &&
        data.logo !== null &&
        data.logo !== "" &&
        (typeof data.logo !== "string" || !logoPattern.test(data.logo.trim()))
    ) {
        errors.push({
            field: "logo",
            message: "El logo debe ser una ruta válida. Ejemplo: /logos/boca.png",
        });
    }

    // CHEQUEO 5: image opcional.
    //
    // image tampoco es obligatorio porque en schema.prisma está como String?.
    // Pero si viene, queremos que tenga formato:
    // /images/nombre.jpg
    const imagePattern = /^\/images\/.+$/;

    if (
        data.image !== undefined &&
        data.image !== null &&
        data.image !== "" &&
        (typeof data.image !== "string" || !imagePattern.test(data.image.trim()))
    ) {
        errors.push({
            field: "image",
            message: "La imagen debe ser una ruta válida. Ejemplo: /images/boca.jpg",
        });
    }

    // Devolvemos el resultado final.
    // isValid será true solamente si no se acumuló ningún error.
    return {
        isValid: errors.length === 0,
        errors,
    };
};

module.exports = {
    validateTeam,
};