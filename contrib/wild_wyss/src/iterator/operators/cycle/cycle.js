import {createMonadicIterable, iteratorOf } from "../../util/util.js";

export { cycle }

/**
 * {@link cycle Cycle} ties a finite {@link Iterable} into a circular one, or equivalently, the infinite repetition of the original {@link Iterable}.
 * @function
 * @template _T_
 * @pure iterable will not be changed
 * @param { Iterable<_T_> } iterable
 * @returns IteratorMonadType<_T_>
 * @example
 * const cycled = cycle([0,1,2]);
 * console.log(...take(6)(cycled));
 * // => Logs: 0, 1, 2, 0, 1, 2
 */
const cycle = iterable => {

  const cycleIterator = () => {
    let inner = iteratorOf(iterable);

    const next = () => {
      const result = inner.next();
      if (!result.done) return result;

      inner = iteratorOf(iterable);
      return next();
    };

   return { next };
  };

  return createMonadicIterable(cycleIterator);
};
