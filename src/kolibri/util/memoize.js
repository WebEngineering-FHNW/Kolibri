/**
 * @module util/memoize
 * Helper functions for caching previous results.
 */

import { LoggerFactory } from "../logger/loggerFactory.js";

export { memoize }

const { debug } = LoggerFactory("ch.fhnw.kolibri.util.memoize");

/** @private */ const MAX_CACHE_SIZE = 1000;


/**
 * A function that takes a function **f(x)** and returns a new function
 * **f(x)** that stores the result in a cache and returns the result value from the
 * cache for successive invocation of **f(x)**.
 * Where **x** should be a scalar value that can be used as a key in a {@link Map}.
 * The cache hit count is logged on {@link LOG_DEBUG} level.
 *
 * @template _T_, _U_
 * @type {  <_T_, _U_>  (f: FunctionType<_T_,_U_>) => FunctionType<_T_,_U_> }
 * @example
   let fib = n => n < 2 ? 1 : fib(n-1) + fib(n-2);
   fib = memoize(fib);
   fib(2)  // is 2
 */
const memoize = f => {
    const cache = new Map();
    let   cacheHitCount = 0;
    return x => {
        if (cache.size >= MAX_CACHE_SIZE) {
            cache.clear();
        }
        let y = cache.get(x);
        if (undefined === y) {
            y = f(x);
            cache.set(x,y);
        } else {
            debug("memoized cache hits: " + (++cacheHitCount) );
        }
        return y;
    }
};
