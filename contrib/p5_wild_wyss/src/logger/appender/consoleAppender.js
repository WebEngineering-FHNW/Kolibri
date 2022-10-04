export {Appender}

import {traceLogger, debugLogger, infoLogger, warnLogger, errorLogger, fatalLogger, LOG_ERROR} from "../logger.js";

/**
 *
 * @returns {AppenderType}
 * @constructor
 */
const Appender = () => {
  return { trace, debug, info, warn, error, fatal, setActiveLogLevel };
};

/**
 * state of the currently activated loglevel
 * @type {LogLevel}
 * @private
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
 * @type {LogType}
 */
const trace = traceLogger(activeLogLevel)(msg => console.error(msg));

/**
 * the function to log debug logs in this application
 * @type {LogType}
 */
const debug = debugLogger(activeLogLevel)(msg => console.log(msg));

/**
 * the function to log debug logs in this application
 * @type {LogType}
 */
const info = infoLogger(activeLogLevel)(msg => console.log(msg));

/**
 * the function to log warn logs in this application
 * @type {LogType}
 */
const warn = warnLogger(activeLogLevel)(msg => console.warn(msg));

/**
 * the function to log error logs in this application
 * @type {LogType}
 */
const error = errorLogger(activeLogLevel)(msg => console.error(msg));

/**
 * the function to log error logs in this application
 * @type {LogType}
 */
const fatal = fatalLogger(activeLogLevel)(msg => console.error(msg));
