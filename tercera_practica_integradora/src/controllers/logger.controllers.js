export const tryLoggers = async (req, res) => {
    try {
        req.logger.debug('DEBUG');
        req.logger.info('INFO');
        req.logger.warn('WARNING');
        req.logger.error('ERROR');
        req.logger.fatal('FATAL');
        
        res.send('Correcto');
    } catch (error) {
        res.status(500).send("Error en la prueba del logger: " + error.message);
    }
};