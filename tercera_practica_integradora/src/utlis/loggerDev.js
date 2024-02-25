import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    }
}

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.simple()
        }),
        new winston.transports.File({ filename: './errors.log', level: 'error'})
    ]
})

export const addLoggerDevelopment = (req, res, next) => {
    req.logger = logger
    
    next()
}