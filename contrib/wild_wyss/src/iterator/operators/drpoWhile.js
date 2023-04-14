import { nextOf } from "../util/util.js";

export { dropWhile }

/**
 * Proceeds with the iteration where the predicate no longer holds.
 *
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
 * // discard all elements until one element is bigger or equal to 2.
 * const dropped = dropWhile(el => el < 2)(it);
 */
const dropWhile = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    let { done, value } = nextOf(inner);

    while(!done && predicate(value)) {
      const n = nextOf(inner);
      done    = n.done;
      value   = n.value;
    }

    return { done, value }
  };

  return createIteratorWithArgs(next)(dropWhile)(predicate)(inner);
};
