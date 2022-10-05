export {Appender}

import { Appender as ArrayAppender } from "./arrayAppender.js";

const {  trace, debug, info, warn, error, fatal, setActiveLogLevel, reset, getAppenderArray  } = ArrayAppender();

/**
 * Concat all log messages into a single string.
 * Use {@link getAppenderValue} to get the latest value
 * and use {@link reset} to clear the string.
 * @returns {AppenderType}
 * @constructor
 */
const Appender = () => {
  return { trace, debug, info, warn, error, fatal, setActiveLogLevel, reset, getAppenderValue };
};

/**
 *
 * @returns {string} - The current value of the appender string
 */
const getAppenderValue = delimiter => getAppenderArray().join(delimiter);