import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { reverse$ }

/**
 * Processes the iterable backwards.
 *
 * @function
 * @pure
 * @haskell [a] -> [a]
 * @template _T_
 * @type {
 *             (iterable: Iterable<_T_>)
 *          => SequenceType<_T_>
 *       }
 *
 * @example
 * const numbers  = [0, 1, 2];
 * const reversed = reverse$(numbers);
 *
 * console.log(...reversed);
 * // => Logs '2, 1, 0'
 */
const reverse$ = iterable => {

  // wrap the code in a function, to keep laziness
  const reverse$Iterator = () => {
    const values         = [...iterable].reverse();
    const valuesIterator = iteratorOf(values);
    return { next: () => valuesIterator.next() };
  };

  return createMonadicSequence(reverse$Iterator);
};