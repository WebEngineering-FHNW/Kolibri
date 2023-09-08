import { max$ } from "../max/max.js";

export { min$ }

/**
 * @typedef MinOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns _T_
 */
/**
 *  Returns the smallest element of a **non-empty** {@link Iterable}.
 *
 *  _Note_:
 *  To determine the  smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current smallest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link min$}
 *  and will then be used to determine the smallest element.
 *
 *
 * @typedef MinOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> a
 * @param { Iterable<_T_> } iterable             - a non-empty finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const minimum = min$(numbers);
 *
 * console.log(minimum);
 * // => Logs '0'
 */

/**
 * see {@link MinOperationType}
 * @template _T_
 * @type { MinOperationType<_T_> }
 */
const min$ = (iterable, comparator = (a, b) => a < b) => max$(iterable, (a,b) => ! comparator(a,b));
