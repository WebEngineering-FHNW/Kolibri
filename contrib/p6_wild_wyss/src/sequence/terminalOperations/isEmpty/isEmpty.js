import { iteratorOf } from "../../util/sequenceUtil/iteratorOf.js";

export { isEmpty }

/**
 * Returns true, if the iterables head is undefined.
 * @function
 * @pure
 * @haskell [a] -> Bool
 * @template _T_
 * @type {
 *            (iterable: Iterable<_T_>)
 *         => Boolean
 *       }
 *
 * @example
 * const empty     = []
 * const result = isEmpty(empty);
 *
 * console.log(result);
 * // Logs 'true'
 */
const isEmpty = iterable => iteratorOf(iterable).next().done;
