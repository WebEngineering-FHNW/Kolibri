/**
 * Make basic logging controls available in the browser console
 * by putting them in the window object.
 * @example
 * // usually in your starter.js
 * import "../kolibri/logger/loggingSupport.js"
 */
import {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
} from "./logLevel.js"

import {
  setLoggingLevel,
  setLoggingContext,
  addToAppenderList,
} from "./logging.js"

import {
  ConsoleAppender as ConsoleAppender
} from "./appender/consoleAppender.js";

export {
  defaultConsoleLogging
}

window["LOG_TRACE"  ] = LOG_TRACE  ;
window["LOG_DEBUG"  ] = LOG_DEBUG  ;
window["LOG_INFO"   ] = LOG_INFO   ;
window["LOG_WARN"   ] = LOG_WARN   ;
window["LOG_ERROR"  ] = LOG_ERROR  ;
window["LOG_FATAL"  ] = LOG_FATAL  ;
window["LOG_NOTHING"] = LOG_NOTHING;

window["setLoggingLevel"  ] = setLoggingLevel  ;
window["setLoggingContext"] = setLoggingContext;

/**
 * Set the logging to the default formatter and console appender.
 * @param { LogContextType } context
 * @param { LogLevelType } level
 * @return { void }
 * @impure side effects the logging setup
 * @example
 * defaultConsoleLogging("ch.fhnw", LOG_WARN);
 */
const defaultConsoleLogging = (context, level) => {
  addToAppenderList(ConsoleAppender());
  setLoggingContext(context);
  setLoggingLevel(level);
};
