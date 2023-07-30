import { pipe }    from "../../operators/pipe/pipe.js";
import { take }    from "../../operators/take/take.js";
import { reduce$ } from "../reduce/reduce.js";

export { show }

/**
 * Transforms the passed {@link Iterable} into a {@link String}.
 *
 * @function
 * @pure
 * @haskell Show a => a -> String
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @param { Number }        [maxValues=50] - the amount of elements that should be printed at most
 * @returns { String }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const text    = show(numbers, 3);
 *
 * console.log(text);
 * // => Logs '[0,1,2]'
 */
const show = (iterable, maxValues = 50) =>
  "[" +
  pipe(
    take(maxValues),
    reduce$((acc, cur) => acc === "" ? cur : `${acc},${String(cur)}`, ""),
  )(iterable)
  + "]";