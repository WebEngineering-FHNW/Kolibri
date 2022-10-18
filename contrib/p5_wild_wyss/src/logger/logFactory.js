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
 *                (loggingLevel: LogLevelType) =>
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
const LogFactory = context => loggingLevel => appender => msgFormatter => ({
      trace:  traceLogger (context)(loggingLevel)(appender.trace)(msgFormatter),
      debug:  debugLogger (context)(loggingLevel)(appender.debug)(msgFormatter),
      info:   infoLogger  (context)(loggingLevel)(appender.info) (msgFormatter),
      warn:   warnLogger  (context)(loggingLevel)(appender.warn) (msgFormatter),
      error:  errorLogger (context)(loggingLevel)(appender.error)(msgFormatter),
      fatal:  fatalLogger (context)(loggingLevel)(appender.fatal)(msgFormatter),
});
