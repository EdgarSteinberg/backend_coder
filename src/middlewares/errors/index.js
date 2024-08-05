import { ErrorCodes } from "../../services/errors/errorCodes.js";

//error => contiene la Excepcion Custom lanzada
export default (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name
            })
            break;
        case ErrorCodes.INVALID_PARAM: 
            res.status(400).send({
                status: 'error',
                error: error.name,
                message: error.message
            });
            break;
        case ErrorCodes.DATABASE_ERROR:
            res.status(500).send({
                status: 'error',
                error: error.name,
                message: error.message
            });
            break;
        default:
            res.status(500).send({
                status: 'error',
                error: 'Unhandled error'
            })
    }
}