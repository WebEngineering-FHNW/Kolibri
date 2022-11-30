export { Appender }

import { False, True, LazyIf, Then, Else, id } from "../lamdaCalculus.js";

const MAX_ARRAY_ELEMENTS    = Number.MAX_SAFE_INTEGER - 1;
const MIN_ARRAY_LENGTH      = 2;
const OVERFLOW_LOG_MESSAGE  =
  "LOG ERROR: Despite running the chosen eviction strategy, the array was full! The first third of the log messages have been deleted!";

/**
 * @param {String[]} currentValue
 * @returns String[]
 * @pure
 */
const DEFAULT_CACHE_EVICTION_STRATEGY  = currentValue => {
  const oneThirdIndex = Math.round(currentValue.length / 3);
  // if oneThird is smaller than the minimum of the array length, slice the whole array.
  const deleteUntilIndex = oneThirdIndex > MIN_ARRAY_LENGTH ? oneThirdIndex: MIN_ARRAY_LENGTH;
  return currentValue.slice(deleteUntilIndex);
};

/**
 * Pushes all log messages into an array.
 * Use {@link getValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @param { Number                   } limit           - the max amount of log messages to keep.
 * @param { UnaryOperation<String[]> } cacheEvictionStrategy  - This function is called, as soon as the
 *      defined limit of log messages is reached. You obtain the current appender
 *      value. Return a new value which will be used as the new value of this appender.
 *      If this parameter is not set, then all log messages until now will be discarded.
 * @returns {AppenderType.<String[]>}
 */
const Appender = (limit = MAX_ARRAY_ELEMENTS, cacheEvictionStrategy = DEFAULT_CACHE_EVICTION_STRATEGY) => {
  const calculatedLimit = MIN_ARRAY_LENGTH < limit ? limit: MIN_ARRAY_LENGTH;
  return {
    /**
     * the function to append trace logs in this application
     * @type { AppendCallback }
     */
    trace: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append debug logs in this application
     * @type { AppendCallback }
     */
    debug: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append info logs in this application
     * @type { AppendCallback }
     */
    info: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append warn logs in this application
     * @type { AppendCallback }
     */
    warn: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append error logs in this application
     * @type { AppendCallback }
     */
    error: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append fatal logs in this application
     * @type { AppendCallback }
     */
    fatal: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
    getValue: getValue,
    reset: reset,
  };
};

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
  const currentAppenderArray  = appenderArray;
  appenderArray               = [];
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
  LazyIf(full(limit))
    // if the array is full, call the overflow function and add the new value afterwards.
    (Then(() => append(msg)(limit)(onOverflow)))
    // in any other case just append the new message.
    (Else(() => append(msg)(limit)(    id    )));

/**
 * Returns {@link True} if the appender array equals the limit.
 * @param { number } limit
 * @returns churchBoolean
 * @private
 */
const full = limit =>
  limit === appenderArray.length  ? True: False;


/**
 * Appends the given message to the array.
 * If the array length equals the param limit, the array cache will be evicted using the defined eviction strategy.
 * @type  {
 *          (msg: String!) =>
 *          (limit: number!) =>
 *          (evictionStrategy: unaryOperation<String[]>!) =>
 *          churchBoolean
 *        }
 */
const append = msg => limit => evictionStrategy => {
  // evict the array using the given evictionStrategy
  appenderArray = evictionStrategy(appenderArray);
  LazyIf(full(limit))
    (Then(() => {
      // if array is full, despite using the set eviction strategy, use the default eviction strategy to make space.
      appenderArray = DEFAULT_CACHE_EVICTION_STRATEGY(appenderArray);
      appenderArray.push(OVERFLOW_LOG_MESSAGE);
      appenderArray.push(msg)
    }))
    (Else( () => appenderArray.push(msg)));
  return True;
};
