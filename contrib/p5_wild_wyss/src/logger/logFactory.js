export {LogFactory}

import {
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger
} from "./logger.js";


const LogFactory = context => activeLogLevel => appender => msgFormatter => ({
      trace:  traceLogger (context)(activeLogLevel)(appender.trace)(msgFormatter),
      debug:  debugLogger (context)(activeLogLevel)(appender.debug)(msgFormatter),
      info:   infoLogger  (context)(activeLogLevel)(appender.info) (msgFormatter),
      warn:   warnLogger  (context)(activeLogLevel)(appender.warn) (msgFormatter),
      error:  errorLogger (context)(activeLogLevel)(appender.error)(msgFormatter),
      fatal:  fatalLogger (context)(activeLogLevel)(appender.fatal)(msgFormatter),

});
