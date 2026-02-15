import {iteratorOf} from "../../util/helpers.js";

export { isEmpty }

/**
 * Returns true, if the iterables head is undefined.
 * @typedef IsEmptyOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> Bool
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

/**
 * see {@link IsEmptyOperationType}
 * @template _T_
 * @type { IsEmptyOperationType<_T_> }
 */
const isEmpty = iterable => iteratorOf(iterable).next().done;
