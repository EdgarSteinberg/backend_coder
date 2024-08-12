import winston from "winston";
import __dirname from "./utils/constantsUtil.js";
// Niveles de errores del mas severo [error] al menos importante [silly]
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6

// Crea Errores de nieveles personalizados
const CustomErrLevels = {
    levels: { debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0 },
    colors: { debug: 'blue', http: 'magenta', info: 'green', warning: 'yellow', error: 'red', fatal: 'red' }
};

// DevLogger
const devLogger = winston.createLogger({
    levels: CustomErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: CustomErrLevels.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ]
});

// ProductLogger
const prodLogger = winston.createLogger({
    levels: CustomErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: CustomErrLevels.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ level: 'error', filename: `${__dirname}/logs/errors.log` })
    ]
});

// Este middleware inyecta el logger en el objeto req habilitado a nivel global en app.js
const addLogger = (req, res, next) => {
    req.logger = devLogger;
    req.logger.debug(`${new Date().toDateString()} ${req.method} en ${req.url}`)
    next();
}

//export { addLogger };
export default addLogger;
//export { devLogger, prodLogger, addLogger };
export { devLogger, prodLogger };