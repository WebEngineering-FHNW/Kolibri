import { dropWhile } from "../dropWhile/dropWhile.js";
import {createMonadicSequence, iteratorOf} from "../../util/util.js";

export { drop }

/**
 * Jumps over so many elements.
 *
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (count: number)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0,1,2,3];
 * const dropped = drop(2)(numbers);
 *
 * console.log(...dropped);
 * // => Logs 2, 3
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
