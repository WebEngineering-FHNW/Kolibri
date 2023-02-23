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
 * @type       {
 *                (context: String) =>
 *                (formatMsg: FormatLogMessage) =>
 *                LoggerType
 *             }
 * @constructor
 * @example
 * import { Appender } from "consoleAppender.js"
 * const { trace, debug } = LogFactory("ch.fhnw")(_context => _level => id);
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = context => formatMsg => ({
      trace:  traceLogger(context)(formatMsg),
      debug:  debugLogger(context)(formatMsg),
      info:   infoLogger (context)(formatMsg),
      warn:   warnLogger (context)(formatMsg),
      error:  errorLogger(context)(formatMsg),
      fatal:  fatalLogger(context)(formatMsg),
});
