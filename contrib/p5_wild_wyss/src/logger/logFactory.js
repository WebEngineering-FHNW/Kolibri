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
 * @type {(String) => (LogLevelType) => (AppenderType) => (MsgFormatType) => LoggerType}
 * @constructor
 * @example
 * import {Appender} from "consoleAppender.js"
 * const { trace, debug} = LogFactory("ch.fhnw")(() => LOG_DEBUG)(Appender())(_ => id);
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild") // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LogFactory = context => activeLogLevel => appender => msgFormatter => ({
      trace:  traceLogger (context)(activeLogLevel)(appender.trace)(msgFormatter),
      debug:  debugLogger (context)(activeLogLevel)(appender.debug)(msgFormatter),
      info:   infoLogger  (context)(activeLogLevel)(appender.info) (msgFormatter),
      warn:   warnLogger  (context)(activeLogLevel)(appender.warn) (msgFormatter),
      error:  errorLogger (context)(activeLogLevel)(appender.error)(msgFormatter),
      fatal:  fatalLogger (context)(activeLogLevel)(appender.fatal)(msgFormatter),
});
