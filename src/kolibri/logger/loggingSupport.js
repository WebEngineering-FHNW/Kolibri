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
    addToAppenderList, setGlobalMessageFormatter,
} from "./logging.js";

import {
  ConsoleAppender as ConsoleAppender
} from "./appender/consoleAppender.js";

export {
  defaultConsoleLogging,
  lineSupportFormatter,
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
 * A log formatter that includes the location of the logged line by
 * inspecting the stack frames.
 * @warn This can be expensive when logging excessively
 * @warn It is a best-effort approach and might not work in all circumstances
 * @type { LogMessageFormatterType }
 */
const lineSupportFormatter = context => level => msg => {
    let line;
    try {
        // noinspection ExceptionCaughtLocallyJS
        throw Error("logger");
    } catch(e) {
        const stackFrames = e.stack.split("\n");
        // Safari has removed the "Error: logger" from the stack frames, while chrome and firefox have it
        // Maintainer note: when the test cases fail for a certain browser only, this is likely the culprit
        const offset = stackFrames[0].match("Error") ? 1 : 0;
        line = stackFrames[4+offset]; // as long as the logger impl. does not change, the call site is always so deep in the stack
    }
    return `${msg} ${line} ${context} ${level}`;
};
/**
 * Set the logging to the default formatter and console appender.
 * @param { LogContextType } context
 * @param { LogLevelType }   level
 * @param { Boolean? }       includeLines - extensive logging with line numbers (slower), optional, default = false
 * @return { void }
 * @impure side effects the logging setup
 * @example
 * defaultConsoleLogging("ch.fhnw", LOG_WARN);
 */
const defaultConsoleLogging = (context, level, includeLines = false) => {
    if (includeLines) {
        setGlobalMessageFormatter(lineSupportFormatter);
    }
    addToAppenderList(ConsoleAppender());
    setLoggingContext(context);
    setLoggingLevel(level);
};
