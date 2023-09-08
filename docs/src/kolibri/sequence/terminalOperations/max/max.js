import { ILLEGAL_ARGUMENT_EMPTY_ITERABLE } from "../../util/errorMessages.js";
import { safeMax$ }                        from "./safeMax.js";

export { max$ }

/**
 * @typedef MaxOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 */

/**
 *  Returns the largest element of a **non-empty** {@link Iterable}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link max$}
 *  and will then be used to determine the largest element.
 * @typedef MaxOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> a
 * @param { Iterable<_T_> }         iterable     - a non-empty finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const maximum = max$(numbers);
 *
 * console.log(maximum);
 * // => Logs '5'
 */

/**
 * see {@link MaxOperationType}
 * @template _T_
 * @type { MaxOperationType<_T_> }
 */
const max$ = (iterable, comparator = (a, b) => a < b) => {
  let returnVal;
  const maybeResult = safeMax$(iterable, comparator);

  maybeResult
    (_ => { throw Error(ILLEGAL_ARGUMENT_EMPTY_ITERABLE) })
    (x => returnVal = x);

  return returnVal;
};
