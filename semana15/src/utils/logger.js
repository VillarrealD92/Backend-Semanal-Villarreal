import { createLogger, transports, format } from 'winston';

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5
};

const colors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta'
};


const logFormat = format.combine(
  format.timestamp(),
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);


const developmentLogger = createLogger({
  levels,
  level: 'debug',
  transports: [
    new transports.Console({
      format: logFormat
    })
  ]
});


const productionLogger = createLogger({
  levels,
  level: 'info',
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' })
  ]
});


export { developmentLogger, productionLogger };