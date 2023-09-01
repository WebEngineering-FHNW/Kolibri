import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { retainAll }

/**
 * Only keeps elements which fulfil the given {@link Predicate}.
 *
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @template _T_
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 *
 * // just keep even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 *
 * console.log(...filtered);
 * // => Logs '0, 2, 4'
 *
 */
const retainAll = predicate => iterable => {

  const retainAllIterator = () => {
    const inner = iteratorOf(iterable);

    const next = () => {
      while(true) {
        const { done, value } = inner.next();
        const result = done || predicate(value);
        if (result) return { /**@type boolean */done, value } ;
      }
    };
    return { next };
  };

  return createMonadicSequence(retainAllIterator);
};