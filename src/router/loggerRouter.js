import { Router } from 'express';

import { devLogger, prodLogger } from '../logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
    try {
        // Logs de prueba para devLogger (solo en desarrollo)
        devLogger.debug('Este es un mensaje de debug desde el endpoint /loggerTest');
        devLogger.http('Este es un mensaje HTTP desde el endpoint /loggerTest');
        devLogger.info('Este es un mensaje informativo desde el endpoint /loggerTest');
        devLogger.warning('Este es un mensaje de advertencia desde el endpoint /loggerTest');
        devLogger.error('Este es un mensaje de error desde el endpoint /loggerTest');
        devLogger.fatal('Este es un mensaje fatal desde el endpoint /loggerTest');

        // Logs de prueba para prodLogger (solo en producción)
        prodLogger.debug('Este es un mensaje de debug desde el endpoint /loggerTest');
        prodLogger.http('Este es un mensaje HTTP desde el endpoint /loggerTest');
        prodLogger.info('Este es un mensaje informativo desde el endpoint /loggerTest');
        prodLogger.warning('Este es un mensaje de advertencia desde el endpoint /loggerTest');
        prodLogger.error('Este es un mensaje de error desde el endpoint /loggerTest');
        prodLogger.fatal('Este es un mensaje fatal desde el endpoint /loggerTest');

        res.send('Logs de prueba enviados correctamente.');
    } catch (error) {
        prodLogger.error(`Error en /loggerTest: ${error.message}`);
        res.status(500).send('Hubo un error al ejecutar el test de logs.');
    }
});

export default router;