import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { take }

/**
 * Stop after so many elements.
 *
 * @function
 * @pure
 * @template _T_
 * @type {
 *           (count: Number)
 *        => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0,1,2,3];
 * const taken   = take(2)(numbers);
 *
 * console.log(...taken);
 * // => Logs '0, 1'
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

  return createMonadicSequence(takeIterator);
};