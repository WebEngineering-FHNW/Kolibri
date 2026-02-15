import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { takeWhile }

/**
 * Proceeds with the iteration until the predicate becomes true.
 * @typedef TakeWhileOperationType
 * @template _T_
 * @function
 * @pure (a -> Bool) -> [a] -> [a]
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const number  = [0, 1, 2, 3, 4 ,5];
 *
 * // keep all elements until one element is bigger or equal to 2.
 * const dropped = takeWhile(el => el <= 2)(numbers);
 *
 * console.log(...result);
 * // => Logs '0, 1, 2'
 */

/**
 * see {@link TakeWhileOperationType}
 * @template _T_
 * @type { TakeWhileOperationType<_T_> }
 */
const takeWhile = predicate => iterable => {

  const takeWhileIterator = () => {
    const inner = iteratorOf(iterable);

    const next = () => {
      const el = inner.next();
      // the iterator finishes, when the predicate does not return true anymore,
      // or the previous iterator has no more elements left
      const done = el.done || !predicate(el.value);

      return  { value: el.value, done };
    };

    return { next };
  };

  return createMonadicSequence(takeWhileIterator)
};
