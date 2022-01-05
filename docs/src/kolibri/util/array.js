/**
 * @module util/array
 * Augmenting the {@link Array}, {@link String}, and {@link Number} prototypes with functions from the arrayFunctions module.
 * These functions live in their own module such that users of the library can keep their code clean
 * from prototype modifications if they prefer to do so.
 */

import { arrayEq, removeItem, removeAt, times, sum } from "./arrayFunctions.js"
export {
    // there is nothing to export since we only augment the prototypes
}
/**
* @template T
* @typedef {*} T - generic type is unconstrained
*/

/**
 * See {@link arrayEq}.
 * @param {Array<T>} array
 * @return {boolean}
 * @example
 * [1].eq([1]); // true
 */
Array.prototype.eq = function(array) { return arrayEq(this)(array);}

/**
 * See {@link removeAt}.
 * @impure Modifies the array instance.
 * @param  { number } index
 * @return { Array<T> }
 * @example
 * [1,2,3].removeAt(0);
 */
Array.prototype.removeAt = function(index){ return removeAt(this)(index); };

/**
 * See {@link removeItem}.
 * @impure Modifies the array instance.
 * @param  { T } item
 * @return { Array<T> }
 * @example
 * ["a","b","c"].removeItem("b");
 */
Array.prototype.removeItem = function(item){ return removeItem(this)(item); };

/**
 * See {@link times}.
 * @param  { ?timesCallback } callback
 * @return { Array<T> }
 * @example
 * "10".times(it => console.log(it));
 */
String.prototype.times = function(callback){ return times(this)(callback); };

/**
 * See {@link times}.
 * @param  { ?timesCallback } callback
 * @return { Array<T> }
 * @example
 * (5).times(x => x * x); // [0, 1, 4, 9, 16]
 */
Number.prototype.times = function(callback){ return times(this)(callback); };

/**
 * See {@link sum}.
 * @param  { ?sumCallback } callback
 * @return { number }
 * @example
 * [1,2,3].sum();     // 6
 * ["1"].sum(Number); // 1
 */
Array.prototype.sum = function(callback){ return sum(this)(callback); };
