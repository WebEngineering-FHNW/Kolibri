import { createMonadicSequence, iteratorOf } from "../../util/util.js";

export { reverse$ }

/**
 * Processes the iterable backwards.
 * @template _T_
 * @function
 * @pure iterable will not be changed
 * @type {
 *             (iterable: Iterable<_T_>)
 *          => SequenceType<_T_>
 *       }
 * @example
 * const numbers  = [0, 1, 2];
 * const reversed = reverse$(it);
 *
 * console.log(...reversed);
 * // => Logs 2, 1, 0
 */
const reverse$ = iterable => {

  // wrap the code in a function, to keep lazyness
  const reverse$Iterator = () => {
    const values         = [...iterable].reverse();
    const valuesIterator = iteratorOf(values);
    return { next: () => valuesIterator.next() };
  };

  return createMonadicSequence(reverse$Iterator);
};
