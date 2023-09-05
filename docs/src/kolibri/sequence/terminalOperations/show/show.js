import { pipe }    from "../../operators/pipe/pipe.js";
import { take }    from "../../operators/take/take.js";
import { reduce$ } from "../reduce/reduce.js";

export { show }

/**
 * Transforms the passed {@link Iterable} into a {@link String}.
 * Elements are passes through the String() constructor, separated by a commas and enclosed in square brackets.
 * @typedef ShowOperationType
 * @function
 * @pure
 * @haskell Show a => [a] -> String
 * @param { Number }   [maxValues=50] - the maximum amount of elements that should be printed
 * @returns { String }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const text    = show(numbers, 3);
 *
 * console.log(text);
 * // => Logs '[0,1,2]'
 */

/**
 * see {@link ShowOperationType}
 * @param { Iterable } iterable
 * @param { Number }   [maxValues=50] - the maximum amount of elements that should be printed
 * @return { String }
 */
const show = (iterable, maxValues = 50) =>
  "[" +
  pipe(
    take(maxValues),
    reduce$((acc, cur) => acc === "" ? cur : `${acc},${String(cur)}`, ""),
  )(iterable)
  + "]";
