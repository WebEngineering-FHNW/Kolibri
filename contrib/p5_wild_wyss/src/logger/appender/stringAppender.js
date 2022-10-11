export {Appender}

import { id} from "../../../../../docs/src/kolibri/stdlib.js";
import { Appender as ArrayAppender } from "./arrayAppender.js";

/**
 * Concat all log messages into a single string.
 * Use {@link getAppenderValue} to get the latest value
 * and use {@link reset} to clear the string.
 * @returns {AppenderType}
 * @constructor
 */
const Appender = (formatLogMsg = _ => id) => {
  const {  trace, debug, info, warn, error, fatal, setActiveLogLevel, reset, getAppenderArray= getAppenderValue  } = ArrayAppender(formatLogMsg);
  /**
   *
   * @returns {string} - The current value of the appender string
   */
  const getAppenderValue = delimiter => getAppenderArray().join(delimiter);

  return {trace, debug, info, warn, error, fatal, setActiveLogLevel, reset, getAppenderValue};
};

