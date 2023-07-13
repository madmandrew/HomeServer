import winston, { createLogger, format } from "winston"

export const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
  ],
})
