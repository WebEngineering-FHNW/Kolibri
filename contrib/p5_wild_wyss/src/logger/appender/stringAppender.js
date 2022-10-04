export {Appender}

import {traceLogger, debugLogger, infoLogger, warnLogger, errorLogger, fatalLogger, LOG_ERROR} from "../logger.js";

/**
 * Concat all log messages into a single string.
 * Use {@link getAppenderString} to get the latest value
 * and use {@link reset} to clear the string.
 * @returns {AppenderType}
 * @constructor
 */
const Appender = () => {
  return { trace, debug, info, warn, error, fatal, setActiveLogLevel, reset, getAppenderString };
};

/**
 * Collects all log messages by concatenating.
 * @private
 * @type {string}
 */
let appenderString = "";

/**
 * Clears the current appender string.
 * @returns {string} - the last value before clearing
 */
const reset = () => {
  const currentString = appenderString;
  appenderString = "";
  return currentString;
};

/**
 *
 * @returns {string} - The current value of the appender string
 */
const getAppenderString = () => appenderString;

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
const trace = traceLogger(activeLogLevel)(msg => appenderString += msg);

/**
 * the function to log debug logs in this application
 * @type {LogType}
 */
const debug = debugLogger(activeLogLevel)(msg => appenderString += msg);

/**
 * the function to log debug logs in this application
 * @type {LogType}
 */
const info = infoLogger(activeLogLevel)(msg => appenderString += msg);

/**
 * the function to log warn logs in this application
 * @type {LogType}
 */
const warn = warnLogger(activeLogLevel)(msg => appenderString += msg);

/**
 * the function to log error logs in this application
 * @type {LogType}
 */
const error = errorLogger(activeLogLevel)(msg => appenderString += msg);

/**
 * the function to log error logs in this application
 * @type {LogType}
 */
const fatal = fatalLogger(activeLogLevel)(msg => appenderString += msg);
