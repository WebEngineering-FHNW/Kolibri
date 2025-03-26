import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

/**
 * {@link cycle} ties a finite {@link Iterable} into a circular one, or equivalently,
 * the infinite repetition of the original {@link Iterable}.
 *
 * @template _T_
 * @typedef CycleOperationType
 * @function
 * @pure
 * @haskell [a] -> [a]
 * @type { SequenceOperation<_T_>}
 *
 * @example
 * const numbers = [0, 1, 2];
 * const cycled = cycle(numbers);
 * const result = take(6)(cycled);
 *
 * console.log(...result);
 * // => Logs '0, 1, 2, 0, 1, 2'
 */
export { cycle }

/**
 * see {@link CycleOperationType}
 * @template _T_
 * @type { CycleOperationType<_T_> }
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
