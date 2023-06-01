import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export {take}

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
const take = count => iterable => {

  const takeIterator = () => {
    const inner = iteratorOf(iterable);
    let start = 0;

    const next = () => {
      const el = inner.next();
      // the iterator finishes, when the predicate does not return true anymore,
      // or the previous iterator has no more elements left
      const done = el.done || start++ >= count;
      return { value: el.value, done };
    };

    return { next };
  };

  return createMonadicIterable(takeIterator);
};

