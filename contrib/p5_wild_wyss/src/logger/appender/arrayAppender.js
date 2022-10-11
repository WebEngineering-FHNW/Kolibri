export {Appender}
import {id, True} from "../../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {traceLogger, debugLogger, infoLogger, warnLogger, errorLogger, fatalLogger, LOG_ERROR} from "../logger.js";

/**
 * Pushes all log messages into an array.
 * Use {@link getAppenderValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @returns {AppenderType}
 * @constructor
 */
const Appender = (msgFormatter = _ => id) => ({
  trace:  trace (msgFormatter),
  debug:  debug (msgFormatter),
  info:   info  (msgFormatter),
  warn:   warn  (msgFormatter),
  error:  error (msgFormatter),
  fatal:  fatal (msgFormatter),
  setActiveLogLevel,
  reset,
  getAppenderValue,
});

/**
 * Collects all log messages by storing them in the array.
 * @private
 * @type {Array<String>}
 */
let appenderArray = [];

/**
 * Clears the current appender array.
 * @returns {Array} - the last value before clearing
 */
const reset = () => {
  const currentAppenderArray = appenderArray;
  appenderArray = [];
  return currentAppenderArray;
};

/**
 *
 * @returns {Array<String>} - The current value of the appender string
 */
const getAppenderValue = () => appenderArray;

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

const appenderCallback = msg => {
  appenderArray.push(msg);
  return True;
};

/**
 * the function to log trace logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const trace = traceLogger(activeLogLevel)(appenderCallback);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const debug = debugLogger(activeLogLevel)(appenderCallback);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const info = infoLogger(activeLogLevel)(appenderCallback);

/**
 * the function to log warn logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const warn = warnLogger(activeLogLevel)(appenderCallback);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const error = errorLogger(activeLogLevel)(appenderCallback);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const fatal = fatalLogger(activeLogLevel)(appenderCallback);
