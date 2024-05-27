import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { reverse$ }

/**
 * Processes the iterable backwards.
 * @typedef ReverseOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> [a]
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

/**
 * see {@link ReverseOperationType}
 * @template _T_
 * @type { ReverseOperationType<_T_> }
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
