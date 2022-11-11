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
 *                (appender: AppenderType[]) =>
 *                (msgFormatter: MsgFormatType) =>
 *                LoggerType
 *             }
 * @constructor
 * @example
 * import { Appender } from "consoleAppender.js"
 * const { trace, debug } = LogFactory(() => [Appender()])("ch.fhnw")(_1 => _2 => id);
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = activeAppenderCallback => context => msgFormatter => ({
      trace:  traceLogger (activeAppenderCallback)(context)(msgFormatter),
      debug:  debugLogger (activeAppenderCallback)(context)(msgFormatter),
      info:   infoLogger  (activeAppenderCallback)(context)(msgFormatter),
      warn:   warnLogger  (activeAppenderCallback)(context)(msgFormatter),
      error:  errorLogger (activeAppenderCallback)(context)(msgFormatter),
      fatal:  fatalLogger (activeAppenderCallback)(context)(msgFormatter),
});
