export {Appender}
import {True} from "../lamdaCalculus.js";

/**
 * Pushes all log messages into an array.
 * Use {@link getValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @returns {AppenderType<Array<String>>}
 * @constructor
 */
const Appender = () => ({
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  getValue,
  reset,
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
const getValue = () => appenderArray;

const appenderCallback = msg => {
  appenderArray.push(msg);
  return True;
};

/**
 * the function to log trace logs in this application
 * @type {(MsgFormatType)  => append}
 */
const trace = appenderCallback;

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatType)  => append}
 */
const debug = appenderCallback;

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatType)  => append}
 */
const info = appenderCallback;

/**
 * the function to log warn logs in this application
 * @type {(MsgFormatType)  => append}
 */
const warn = appenderCallback;

/**
 * the function to log error logs in this application
 * @type {(MsgFormatType)  => append}
 */
const error = appenderCallback;

/**
 * the function to log error logs in this application
 * @type {(MsgFormatType)  => append}
 */
const fatal = appenderCallback;
