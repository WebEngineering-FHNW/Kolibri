import { nextOf } from "../util/util.js";

export { take }

/**
 * Stop after so many elements
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (count: Number)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Iterator(0, inc, stop);
 * // only keep the next 4 elements, ignore the others
 * const taken = take(4)(it);
 */
const take = count => iterator => {

  /**
   * @type { <_T_>
   *     (start: Number)
   *  => (count: Number)
   *  => (iterator: IteratorType<_T_>)
   *  => IteratorType<_T_>
   * }
   */
  const takeFactory = start => count => iterator => {
    const inner = iterator.copy();

    const next = () => {
      const el = nextOf(inner);
      // the iterator finishes, when the predicate does not return true anymore,
      // or the previous iterator has no more elements left
      const done = el.done || start++ >= count;
      return { value: el.value, done };
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => takeFactory(start)(count)(inner)
    };
  };
  return takeFactory(0)(count)(iterator);
};
