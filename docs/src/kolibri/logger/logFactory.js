export { LogFactory }

import {
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger
} from "./logger.js";

/**
 * Constructs logger for each log levels using the given parameters.
 * @param { String } context - The origin of the log statement
 * @returns { LoggerType }
 * @constructor
 * @example
 * const { trace, debug } = LogFactory("ch.fhnw");
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = context => ({
      trace:  traceLogger(context),
      debug:  debugLogger(context),
      info:   infoLogger (context),
      warn:   warnLogger (context),
      error:  errorLogger(context),
      fatal:  fatalLogger(context),
});
