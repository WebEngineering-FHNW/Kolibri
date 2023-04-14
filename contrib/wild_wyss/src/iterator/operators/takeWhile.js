import { nextOf } from "../util/util.js";

export { takeWhile }

/**
 * Proceeds with the iteration until the predicate becomes true
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (predicate: (_T_) => Boolean)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
 * // keep all elements until one element is bigger or equal to 2.
 * const dropped = takeWhile(el => el < 2)(it);
 */
const takeWhile = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const el = nextOf(inner);
    // the iterator finishes, when the predicate does not return true anymore,
    // or the previous iterator has no more elements left
    const done = el.done || !predicate(el.value);

    return  { value: el.value, done };
  };

  return createIteratorWithArgs(next)(takeWhile)(predicate)(inner);
};
