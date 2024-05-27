import {dropWhile}             from "../dropWhile/dropWhile.js";
import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { drop }

/**
 * Jumps over so many elements.
 *
 * @template _T_
 * @typedef DropOperationType
 * @function
 * @pure
 * @haskell Int -> [a] -> [a]
 * @type {
 *            (count: number)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const dropped = drop(2)(numbers);
 *
 * console.log(...dropped);
 * // => Logs '2, 3'
 */

/**
 * see {@link DropOperationType}
 * @template _T_
 * @type { DropOperationType<_T_> }
 */
const drop = count => iterable => {
  const dropIterator = () => {
    let start               = 0;
    const dropWhileIterable = dropWhile(_ => start++ < count)(iterable);
    const inner             = iteratorOf(dropWhileIterable);

    return { next : inner.next }
  };

  return createMonadicSequence(dropIterator);
};
