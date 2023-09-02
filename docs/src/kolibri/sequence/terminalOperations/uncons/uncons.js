import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";
import { Pair }                  from "../../../stdlib/pair.js";

export { uncons }

/**
 * Removes the first element of this iterable.
 * The head and the tail of the iterable are returned then
 *
 * @function
 * @pure
 * @haskell [a] -> (a, [a])
 * @template _T_
 * @param   { Iterable<_T_> } iterable
 * @returns { (s: PairSelectorType) => (_T_ |Iterable<_T_>) } - the head and the tail as a pair
 *
 * @example
 * const numbers       = [0, 1, 2, 3, 4];
 * const [head, tail]  = uncons(numbers);
 *
 * console.log("head:", head, "tail:", ...tail);
 * // => Logs 'head: 0 tail: 1 2 3 4'
 */
const uncons = iterable => {
  const inner = iteratorOf(iterable);
  const { value } = inner.next();

  const iterator = () => ({ next: () => inner.next() });

  return Pair(value)(createMonadicSequence(iterator));
};