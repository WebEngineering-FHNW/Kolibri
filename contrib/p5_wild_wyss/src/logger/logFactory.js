export {LogFactory}

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
 *                (appender: AppenderType) =>
 *                (msgFormatter: MsgFormatType) =>
 *                LoggerType
 *             }
 * @constructor
 * @example
 * import {Appender} from "consoleAppender.js"
 * const { trace, debug} = LogFactory("ch.fhnw")(() => LOG_DEBUG)(Appender())(_1 => _2 => id);
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = context => appender => msgFormatter => ({
      trace:  traceLogger (context)(appender.trace)(msgFormatter),
      debug:  debugLogger (context)(appender.debug)(msgFormatter),
      info:   infoLogger  (context)(appender.info) (msgFormatter),
      warn:   warnLogger  (context)(appender.warn) (msgFormatter),
      error:  errorLogger (context)(appender.error)(msgFormatter),
      fatal:  fatalLogger (context)(appender.fatal)(msgFormatter),
});
