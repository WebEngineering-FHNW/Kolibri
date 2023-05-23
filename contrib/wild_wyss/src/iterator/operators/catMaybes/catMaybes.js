import { createIterator, nextOf }    from "../../util/util.js";
import { catMaybes as arrCatMaybes } from "../../../stdlib/stdlib.js";

export { catMaybes }

/**
 * The catMaybes function takes an {@link IteratorType} of {@link MaybeType Maybes} and returns an {@link IteratorType} of all the {@link JustXType Justs} values.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
              (iterator: IteratorType<MaybeType<_T_>>)
 *         => IteratorType<_T_>
 *       }
 * @example
 * const maybes = ArrayIterator([Just(5), Just(3), Nothing]);
 * const result = catMaybes(maybes);
 * console.log(...result);
 * // => prints 5,3 to the console
 */
const catMaybes = iterator => {
  const inner = iterator.copy();

  const next = () => {
    while (true) {
      const { value, done } = nextOf(inner);
      if (done) return { value: undefined, done };

      const result = arrCatMaybes([value]);
      if (result.length !== 0) {
        return { value: result[0], done: false };
      }
    }
  };

  const copy = () => catMaybes(inner);
  return createIterator(next, copy);
};