export {Appender}
import {False, True, LazyIf, Then, Else, not} from "../lamdaCalculus.js";

const MAX_ARRAY_ELEMENTS = 100000000000000;

/**
 * This is the default function that gets called when the defined limit has been reached.
 * @param {String[]} _
 * @returns String[]
 * @constructor
 */
const ON_LIMIT_REACHED  = _ => [];

/**
 * Pushes all log messages into an array.
 * Use {@link getValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @type appenderCtor<String[]>
 */
const Appender = (limit = MAX_ARRAY_ELEMENTS, onLimitReached = ON_LIMIT_REACHED) => ({
  /**
   * the function to append trace logs in this application
   * @type {AppendCallback}
   */
  trace:    appenderCallback(limit)(onLimitReached),
  /**
   * the function to append debug logs in this application
   * @type {AppendCallback}
   */
  debug:    appenderCallback(limit)(onLimitReached),
  /**
   * the function to append info logs in this application
   * @type {AppendCallback}
   */
  info:     appenderCallback(limit)(onLimitReached),
  /**
   * the function to append warn logs in this application
   * @type {AppendCallback}
   */
  warn:     appenderCallback(limit)(onLimitReached),
  /**
   * the function to append error logs in this application
   * @type {AppendCallback}
   */
  error:    appenderCallback(limit)(onLimitReached),
  /**
   * the function to append fatal logs in this application
   * @type {AppendCallback}
   */
  fatal:    appenderCallback(limit)(onLimitReached),
  getValue: getValue,
  reset:    reset,
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
/**
 * Appends the next log message to the array.
 * @param limit
 * @type  {
 *          (limit: number) =>
 *          (onLimitReached: unaryOperation<String[]>) =>
 *          churchBoolean
 *        }
 */
const appenderCallback = limit => onOverflow => msg =>
  LazyIf(
    full(limit)
  )
  // if the array is full, call the overflow function and add the new value afterwards.
  (Then(() => append(msg)(limit)(onOverflow)))
  // in any other case just append the new message.
  (Else(() => append(msg)(limit)(          )));

/**
 * Returns {@link True} if the appender array equals the limit.
 * @param { number } limit
 * @returns churchBoolean
 * @private
 */
const full = limit =>
  limit === appenderArray.length  ? True: False;


/**
 * Appends the given message to the array & runs an optional callback afterwards.
 * @type  {
 *          (msg: String) =>
 *          (limit: number) =>
 *          (callback: unaryOperation<String[]>) =>
 *          churchBoolean
 *        }
 */
const append = msg => limit => (callback = undefined) => {
   if (callback instanceof Function) appenderArray = callback(appenderArray);
   const arrayHasSpace = not(full(limit));
   if(arrayHasSpace(true)(false)) appenderArray.push(msg);
   return arrayHasSpace;
};