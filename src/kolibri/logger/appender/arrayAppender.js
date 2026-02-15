/**
 * @module logger/appender/arrayAppender
 * Provides an {@link AppenderType} that stores all log messages in an array.
 * Since many log messages might be generated, we need a strategy to evict old log messages.
 */

import { id, T, LazyIf, churchBool } from "../../lambda/church.js";
import { Nothing }                   from "../../stdlib.js";

export { ArrayAppender };

const MAX_ARRAY_ELEMENTS   = Number.MAX_SAFE_INTEGER - 1;
const MIN_ARRAY_LENGTH     = 2;
const OVERFLOW_LOG_MESSAGE =
          "LOG ERROR: Despite running the chosen eviction strategy, the array was full! The first third of the log messages have been deleted!";

/**
 * @type { CacheEvictionStrategyType }
 * @pure
 */
const DEFAULT_CACHE_EVICTION_STRATEGY = cache => {
    const oneThirdIndex    = Math.round(cache.length / 3);
    // if oneThird is smaller than the minimum of the array length, slice the whole array.
    const deleteUntilIndex = oneThirdIndex > MIN_ARRAY_LENGTH ? oneThirdIndex : MIN_ARRAY_LENGTH;
    return cache.slice(deleteUntilIndex);
};

/**
 * Logs all log messages to an array.
 * Use {@link getValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @param { Number                    } limit           - the max amount of log messages to keep.
 * @param { CacheEvictionStrategyType } cacheEvictionStrategy  - This function is called, as soon as the
 *      defined limit of log messages is reached. You obtain the current appender
 *      value. Return a new value which will be used as the new value of this appender.
 *      If this parameter is not set, then all log messages until now will be discarded.
 * @returns { AppenderType<Array<String>> }
 */
const ArrayAppender = (limit = MAX_ARRAY_ELEMENTS, cacheEvictionStrategy = DEFAULT_CACHE_EVICTION_STRATEGY) => {
    const calculatedLimit = MIN_ARRAY_LENGTH < limit ? limit : MIN_ARRAY_LENGTH;

    let formatter      = Nothing; // per default, we do not use a specific formatter.
    const getFormatter = () => formatter;
    const setFormatter = newFormatter => formatter = newFormatter;

    /**
     * Collects all log messages by storing them in the array.
     * @private
     * @type { Array<String> }
     */
    let appenderArray = [];

    /**
     * Clears the current appender array.
     * @impure
     * @returns { Array<String> } - the last value before clearing
     */
    const reset = () => {
        const oldAppenderArray = appenderArray;
        appenderArray              = [];
        return oldAppenderArray;
    };

    /**
     * @returns { Array<String> } - The current value of the appender string
     */
    const getValue = () => appenderArray;

    /**
     * Appends the next log message to the array.
     * @private
     * @param limit
     * @type  {
     *          (limit:          Number) =>
     *          (onOverflow:     CacheEvictionStrategyType) =>
     *          (msg:            LogMeType) =>
     *          ChurchBooleanType
     *        }
     */
    const appenderCallback = limit => onOverflow => msg =>
        LazyIf(full(limit))
            // if the array is full, call the overflow function and add the new value afterward.
            (() => append(msg)(limit)(onOverflow))
            // in any other case just append the new message.
            (() => append(msg)(limit)(id));

    /**
     * Returns {@link T} if the appender array length hits the limit.
     * @param { Number } limit
     * @returns ChurchBooleanType
     * @private
     */
    const full = limit => churchBool(limit <= appenderArray.length);

    /**
     * Appends the given message to the array.
     * If the array length equals the param limit, the array cache will be evicted using the defined eviction strategy.
     * @private
     * @type  {
     *          (msg: !LogMeType) =>
     *          (limit: !Number) =>
     *          (evictionStrategy: !CacheEvictionStrategyType) =>
     *          ChurchBooleanType
     *        }
     */
    const append = msg => limit => evictionStrategy => {
        // evict the array using the given evictionStrategy
        appenderArray =  /** @type {Array<String>} */ evictionStrategy(appenderArray);
        LazyIf(full(limit))
            (() => {
                // if array is full, despite using the set eviction strategy, use the default eviction strategy to make space.
                appenderArray = /** @type {Array<String>} */DEFAULT_CACHE_EVICTION_STRATEGY(appenderArray);
                appenderArray.push(OVERFLOW_LOG_MESSAGE);
                appenderArray.push(msg);
            })
            (() => appenderArray.push(msg));
        return /** @type {ChurchBooleanType} */ T;
    };

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
        fatal:        appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        getValue,
        reset,
        setFormatter,
        getFormatter
    };
};
