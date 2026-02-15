import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { take }

/**
 * Stop after so many elements.
 *
 * @template _T_
 * @typedef TakeOperationType
 * @function
 * @pure
 * @haskell Int -> [a] -> [a]
 * @type {
 *     (count: Number)
 *     => SequenceOperation<_T_>
 * }
 *
 * @example
 * const numbers = [0,1,2,3];
 * const taken   = take(2)(numbers);
 *
 * console.log(...taken);
 * // => Logs '0, 1'
 */

/**
 * see {@link TakeOperationType}
 * @template _T_
 * @type { TakeOperationType<_T_> }
 */
const take = count => iterable => {

  const takeIterator = () => {
    const inner = iteratorOf(iterable);
    let start = 0;

    const next = () => {
      // the iterator finishes, when the predicate does not return true anymore, // todo dk: copy/paste error?
      // or the previous iterator has no more elements left
      const takeDone = start++ >= count;
      if (takeDone) return { done: true, value: undefined };
      return inner.next();
    };

    return { next };
  };

  return createMonadicSequence(takeIterator);
};
