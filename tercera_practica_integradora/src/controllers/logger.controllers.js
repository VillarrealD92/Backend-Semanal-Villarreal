export const tryLoggers= async (req,res)=>{

    req.logger.debug('DEBUG')
    req.logger.info('INFO')
    req.logger.warning('WARNING')
    req.logger.error('ERROR')
    req.logger.fatal('FATAL')
    
    res.send('Correcto')
    
    }