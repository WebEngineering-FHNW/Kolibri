import { createMonadicIterable, iteratorOf } from "../../util/util.js";
import { Pair } from "../../../stdlib/pair.js";

export { uncons }

/**
 * Removes the first element of this iterable.
 * @function
 * @template _T_
 * @param   { Iterable<_T_> } iterable
 * @returns { (s: PairSelectorType) => (_T_ |Iterable<_T_>) }
 * @pure iterable will not be changed
 * @example
 * const numbers       = [0, 1, 2, 3, 4];
 * const [head, tail]  = uncons(numbers);
 *
 * console.log("head:", head, "tail:", ...tail);
 * // => Logs head: 0 tail: 1 2 3 4
 */
const uncons = iterable => {
  const inner = iteratorOf(iterable);
  const { value } = inner.next();

  const iterator = () => ({next: () => inner.next()});

  return Pair(value)(createMonadicIterable(iterator));
};
