/**
 * @module util/arrayFunctions
 * Utility module for array-dependent functions.
 */

export { arrayEq, removeItem, removeAt, times, sum }

/**
 * A function that compares two arrays for equality by checking that they are of the same length and
 * all elements are pairwise equal with respect to the "===" operator. Arguments are given in curried style.
 * Arguments must not be null/undefined and must be of type {@link Array}.
 * @template T
 * @pure
 * @complexity O(n)
 * @haskell  [a] -> [a] -> bool
 * @function arrayEq
 * @type    { (arrayA:!Array<T>) => (arrayB:!Array<T>) => boolean }
 * @param   { !Array<T>} arrayA - the first array. Mandatory.
 * @returns { (arrayB:!Array<T>) => boolean}
 * @example
 * arrayEq ([])  ([])  === true;
 * arrayEq ([1]) ([2]) === false;
 */
const arrayEq = arrayA => arrayB =>
    arrayA.length === arrayB.length && arrayA.every( (it, idx) => it === arrayB[idx]);

/**
 * From the {@link array}, remove the item at position "index". The arguments are given in curried style.
 * The index must be >= 0 and < `array.length` or nothing is removed and an empty array is returned.
 * @impure Since the given array is modified.
 * @function removeAt
 * @template T
 * @type    { (array:!Array<T>) => (index:!number) => Array<T> }
 * @param   { !Array<T>} array - the array to remove from. Mandatory.
 * @returns { (index:!number) => Array<T> } - finally, the removed element is returned in a singleton array, or an empty array in case nothing was removed, see {@link splice}
 * @example
 * const array = [1,2,3];
 * removeAt(array)(0);
 * arrayEq(array)([2,3]);
 */
const removeAt = array => index => array.splice(index, 1);

/**
 * From the {@link array}, remove the "item". The arguments are given in curried style.
 * In case that the item occurs multiple times in the array, only the first occurrence is removed.
 * @impure Since the given array is modified.
 * @function removeItem
 * @template T
 * @type    { (array:!Array<T>) => (item:!T) => Array<T> }
 * @param   { !Array<T>} array - the array to remove from. Mandatory.
 * @returns { (item:!T) => Array<T> } - finally, the removed element is returned in a singleton array or an empty array in case nothing was removed, see {@link splice}
 * @example
 * const array = ["a","b","c"];
 * removeItem(array)("b");
 * arrayEq(array)(["a","c"]);
 */
const removeItem = array => item => {
    const i = array.indexOf(item);
    if (i >= 0) {
        return removeAt(array)(i);
    }
    return [];
};

/**
 * @callback timesCallback
 * @param {!number} index
 * @template T
 * @return {T}
 */

/**
 * A function that executes the optional {@link timesCallback} "soMany" times, assembles the results and returns them in an
 * {@link array} of length "soMany". The arguments are given in curried style.
 * If no callback is given, the unaltered index is returned. Indexes go from 0 to soMany-1.
 * @impure if the callback is impure
 * @haskell  Int -> (Int -> a) -> [a]
 * @function times
 * @template T
 * @type    { (soMany:!number) => (callback:?timesCallback) => Array<T> }
 * @param   { !number | string } soMany - how often to execute the callback. Negative values will be treated like 0. Mandatory.
 * @returns { (callback:?timesCallback) => Array<T> } - finally returns an array of the assembled callback results
 * @throws  { TypeError } - if soMany is given as a String but does not represent a number
 * @example
 * times(3)(i => console.log(i)); // logs 0, 1, 2
 * times(5)(x=>x*x); // returns [0, 1, 4, 9, 16]
 */
const times = soMany => (callback= undefined) => {
    const number = Number(soMany.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + soMany + "' is not a valid number.");
    }
    return Array.from({length: number}, (it, idx) => callback ? callback(idx) : idx);
};

/**
 * @callback sumCallback
 * @template T
 * @param {!T} item
 * @param {?number} index
 * @return {number}
 */

/**
 * A function that sums up all items from an {@link array} by applying the {@link sumCallback} to each item before adding up.
 * The arguments are given in curried style.
 * If no callback is given, the Number constructor is used.
 * @impure   if the callback is impure
 * @haskell  Num n => [a] -> (a -> n) -> n
 * @function times
 * @template T
 * @type    { (array:!Array<T>) => (callback:?sumCallback) => number }
 * @param   { array:!Array<T> } array - the array to sum up. Mandatory.
 * @returns { (callback:?sumCallback) => number } - finally returns the sum
 * @example
 * sum([1,2,3])()     === 1 + 2 + 3;
 * sum(["1"])(Number) === 1;
 */
const sum = array => (callback = Number) =>
    array.reduce( (acc, cur, idx) => acc + callback(cur, idx), 0);

