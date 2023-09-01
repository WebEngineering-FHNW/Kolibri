import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { cycle }

/**
 * {@link cycle Cycle} ties a finite {@link Iterable} into a circular one, or equivalently,
 * the infinite repetition of the original {@link Iterable}.
 *
 * @function
 * @pure
 * @haskell [a] -> [a]
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns SequenceType<_T_>
 *
 * @example
 * const numbers = [0, 1, 2];
 * const cycled = cycle(numbers);
 * const result = take(6)(cycled);
 *
 * console.log(...result);
 * // => Logs '0, 1, 2, 0, 1, 2'
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

  return createMonadicSequence(cycleIterator);
};
