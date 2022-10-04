export {debug, warn,trace, error, setActiveLogLevel}

import {debugLogger, errorLogger, traceLogger, warnLogger, LOG_ERROR} from "../logger.js";

/**
 * state of the currently activated loglevel
 * @type {LogLevel}
 */
let logLevel = LOG_ERROR;

/**
 * Returns the current logLevel
 * @returns {LogLevel}
 */
const activeLogLevel = () => logLevel;

/**
 * sets a new logLevel
 * @param {LogLevel} newLogLevel
 * @returns {LogLevel}
 * @example
 * setActiveLogLevel(LOG_DEBUG);
 * setActiveLogLevel(LOG_ERROR);
 */
const setActiveLogLevel = newLogLevel => logLevel = newLogLevel;

/**
 * the function to log trace logs in this application
 * @type {function(String): churchBoolean}
 */
const trace = traceLogger(activeLogLevel)(msg => console.error(msg));

/**
 * the function to log debug logs in this application
 * @type {function(String): churchBoolean}
 */
const debug = debugLogger(activeLogLevel)(msg => console.log(msg));

/**
 * the function to log warn logs in this application
 * @type {function(String): churchBoolean}
 */
const warn = warnLogger(activeLogLevel)(msg => console.warn(msg));
/**
 * the function to log error logs in this application
 * @type {function(String): churchBoolean}
 */
const error = errorLogger(activeLogLevel)(msg => console.error(msg));
