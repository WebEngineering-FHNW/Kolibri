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
 *                (appender: AppenderType[]) =>
 *                (context: String) =>
 *                (formatMsg: FormatLogMessage) =>
 *                LoggerType
 *             }
 * @constructor
 * @example
 * import { Appender } from "consoleAppender.js"
 * const { trace, debug } = LogFactory(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = activeAppenderCallback => context => formatMsg => ({
      trace:  traceLogger (activeAppenderCallback)(context)(formatMsg),
      debug:  debugLogger (activeAppenderCallback)(context)(formatMsg),
      info:   infoLogger  (activeAppenderCallback)(context)(formatMsg),
      warn:   warnLogger  (activeAppenderCallback)(context)(formatMsg),
      error:  errorLogger (activeAppenderCallback)(context)(formatMsg),
      fatal:  fatalLogger (activeAppenderCallback)(context)(formatMsg),
});
