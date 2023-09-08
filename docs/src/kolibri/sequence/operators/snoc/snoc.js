import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { snoc }

/**
 * Adds the given element to the end of the {@link Iterable}.
 * @typedef SnocOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell a -> [a] -> [a]
 * @type {
 *           (element: _T_)
 *        => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const snocced = snoc(7)(numbers);
 *
 * console.log(...snocced);
 * // => Logs '0, 1, 2, 3, 7'
 */

/**
 * see {@link SnocOperationType}
 * @template _T_
 * @type { SnocOperationType<_T_> }
 */
const snoc = element => iterable => {
  const snocIterator = () => {
    let last = element;
    const inner = iteratorOf(iterable);

    const next = () => {
      const current = inner.next();
      if (current.done && last !== undefined) {
        const value = element;
        last = undefined;
        return { done: false, value: value }
      }
      return current;
    };

    return { next };
  };

  return createMonadicSequence(snocIterator);
};
