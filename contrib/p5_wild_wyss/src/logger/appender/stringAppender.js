export {Appender}
import {Appender as ArrayAppender} from "./arrayAppender.js";

/**
 * Concat all log messages into a single string.
 * Use {@link getValue} to get the latest value
 * and use {@link reset} to clear the string.
 * @returns {AppenderType<String>}
 * @constructor
 */
const Appender = () => {
  const {  trace, debug, info, warn, error, fatal, getValue : getArrayValue, reset: resetArray } = ArrayAppender();
  /**
   *
   * @returns {String} - The current value of the appender string
   */
  const getValue = delimiter => getArrayValue().join(delimiter);
  const reset = () => {
    const lastValue = getValue("");
    resetArray();
    return lastValue;
  };
  return {trace, debug, info, warn, error, fatal, getValue, reset};
};

