// VALIDACION MANUAL DEL BODY DE AUTENTICACION
// Estas funciones validan los datos que llegan en /register y /login.
// No usamos librerías externas porque la consigna pide validación manual.
//
// Cada función devuelve un objeto con esta forma:
// {
//     isValid: true o false,
//     errors: []
// }
//
// Si errors está vacío, el body es válido.
// Si errors tiene elementos, el controller responde 400.

// Patrón simple de email: algo@algo.algo (sin espacios).
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Largo mínimo de contraseña para el registro.
const MIN_PASSWORD_LENGTH = 6;

// Validación del registro: name, email y password obligatorios.
const validateRegister = (data) => {
    const errors = [];

    // CHEQUEO 0: el body tiene que existir y ser un objeto válido.
    if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
        errors.push({
            field: "body",
            message: "El body no puede estar vacío.",
        });

        return {
            isValid: false,
            errors,
        };
    }

    // CHEQUEO 1: nombre obligatorio.
    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
        errors.push({
            field: "name",
            message: "El nombre es obligatorio y no puede estar vacío.",
        });
    }

    // CHEQUEO 2: email obligatorio y con formato válido.
    if (!data.email || typeof data.email !== "string" || !emailPattern.test(data.email.trim())) {
        errors.push({
            field: "email",
            message: "El email es obligatorio y debe tener un formato válido. Ejemplo: usuario@mail.com",
        });
    }

    // CHEQUEO 3: contraseña obligatoria y con un largo mínimo.
    if (!data.password || typeof data.password !== "string" || data.password.length < MIN_PASSWORD_LENGTH) {
        errors.push({
            field: "password",
            message: `La contraseña es obligatoria y debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Validación del login: solo chequeamos que email y password estén presentes.
// La verificación de credenciales (existe / coincide) se hace en el controller.
const validateLogin = (data) => {
    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
        errors.push({
            field: "body",
            message: "El body no puede estar vacío.",
        });

        return {
            isValid: false,
            errors,
        };
    }

    if (!data.email || typeof data.email !== "string" || data.email.trim() === "") {
        errors.push({
            field: "email",
            message: "El email es obligatorio.",
        });
    }

    if (!data.password || typeof data.password !== "string" || data.password === "") {
        errors.push({
            field: "password",
            message: "La contraseña es obligatoria.",
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

module.exports = {
    validateRegister,
    validateLogin,
};
