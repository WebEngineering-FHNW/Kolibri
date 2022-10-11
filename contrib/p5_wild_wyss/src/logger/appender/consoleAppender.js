export {Appender}
import {True} from "../lamdaCalculus.js";

/**
 * Provides console appender.
 * @returns {AppenderType<void>}
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
});

const getValue = undefined;

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
const trace = appenderCallback(console.trace);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const debug = appenderCallback(console.debug);

/**
 * the function to log debug logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const info = appenderCallback(console.info);

/**
 * the function to log warn logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const warn = appenderCallback(console.warn);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const error = appenderCallback(console.error);

/**
 * the function to log error logs in this application
 * @type {(MsgFormatter)  => LogType}
 */
const fatal = appenderCallback(console.error);
