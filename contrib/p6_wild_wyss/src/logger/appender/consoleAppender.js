export { Appender}

import {True} from "../lamdaCalculus.js";

/**
 * Provides console appender.
 * Using this appender you are able to log to the console.
 * @returns { AppenderType<void> }
 * @constructor
 */
const Appender = () => ({
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  getValue: () => { /* Nothing to do */ },
  reset: () => { /* Nothing to do */ }
});

/**
 * @type { (Consumer) => AppendCallback }
 */
const appenderCallback = callback => msg => {
  callback(msg);
  return True;
};

/**
 * the function to append trace logs in this application
 * @type { AppendCallback }
 */
const trace = appenderCallback(console.trace);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const debug = appenderCallback(console.debug);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const info = appenderCallback(console.info);

/**
 * the function to append warn logs in this application
 * @type { AppendCallback }
 */
const warn = appenderCallback(console.warn);

/**
 * the function to append error logs in this application
 * @type { AppendCallback }
 */
const error = appenderCallback(console.error);

/**
 * the function to append fatal logs in this application
 * @type { AppendCallback }
 */
const fatal = appenderCallback(console.error);
