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
            level: 'info',
            format: winston.format.simple()
        }),
        new winston.transports.File({ filename: './errors.log', level: 'error'})
    ]
})

export const addLoggerProduction = (req, res, next) => {
    req.logger = logger

    next()
}