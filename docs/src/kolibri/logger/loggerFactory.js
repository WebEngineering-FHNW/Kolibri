/**
 * @module logger/loggerFactory
 * Public convenience API for creating loggers.
 */
export { LoggerFactory }

import {
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger
} from "./logger.js";

/**
 * Constructs a logger for each log level using the given context.
 * @param { LogContextType } context
 * @returns { LoggerType }
 * @constructor
 * @example
 * const { trace, debug } = LoggerFactory("ch.fhnw");
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild")  // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LoggerFactory = context => /** @type { LoggerType } */({
      trace:  traceLogger(context),
      debug:  debugLogger(context),
      info:   infoLogger (context),
      warn:   warnLogger (context),
      error:  errorLogger(context),
      fatal:  fatalLogger(context),
});
