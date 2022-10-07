import {id, True} from "../../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {debugLogger, errorLogger, fatalLogger, infoLogger, LOG_ERROR, traceLogger, warnLogger} from "../logger.js";

export {Appender}

/**
 * Provides console appender.
 * @param {MsgFormatter} msgFormatter - an optional formatting function which formats each log message.
 * @returns {AppenderType}
 * @constructor
 */
const Appender = (msgFormatter = _ => id) => ({
  trace: trace(msgFormatter),
  debug: debug(msgFormatter),
  info: info(msgFormatter),
  warn: warn(msgFormatter),
  error: error(msgFormatter),
  fatal: fatal(msgFormatter),
  setActiveLogLevel
});

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
 * @type { (Consumer) => (String) => churchBoolean }
 */
const appenderCallback = callback => msg => {
  callback(msg);
  return True;
};

/**
 * the function to log trace logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const trace = traceLogger(activeLogLevel)(appenderCallback(console.trace));

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const debug = debugLogger(activeLogLevel)(appenderCallback(console.debug));

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const info = infoLogger(activeLogLevel)(appenderCallback(console.info));

/**
 * the function to log warn logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const warn = warnLogger(activeLogLevel)(appenderCallback(console.warn));

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const error = errorLogger(activeLogLevel)(appenderCallback(console.error));

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const fatal = fatalLogger(activeLogLevel)(appenderCallback(console.error));
