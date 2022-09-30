export {debug, warn,trace, error, setActiveLogLevel}

import {DebugLogger, ErrorLogger, LOG_ERROR, TraceLogger, WarnLogger} from "../logger.js";

/**
 * state of the currently activated loglevel
 * @return { () => LogLevel }
 */
let logLevel = LOG_ERROR;

/**
 * Returns the current loglevel
 * @returns {LogLevel}
 */
const activeLogLevel = () => logLevel;

/**
 * sets a new LogLevel
 * @param newLogLevel
 * @example
 * setActiveLogLevel(LOG_DEBUG);
 * setActiveLogLevel(LOG_ERROR);
 */
const setActiveLogLevel = newLogLevel => logLevel = newLogLevel;

/**
 * the function to log debug logs in this application
 * @type {Logger}
 */
const debug = DebugLogger(activeLogLevel)(msg => console.log(msg));

/**
 * the function to log warn logs in this application
 * @type {Logger}
 */
const warn = WarnLogger(activeLogLevel)(msg => console.warn(msg));
/**
 * the function to log error logs in this application
 * @type {Logger}
 */
const error = ErrorLogger(activeLogLevel)(msg => console.error(msg));

const trace = TraceLogger(activeLogLevel)(msg => console.error(msg));