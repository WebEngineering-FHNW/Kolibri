import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR } from "../../util/errorMessages.js";
import { max$ }                            from "../max/max.js";

export { min$ }

/**
 *  Returns the smallest element of a **non-empty** {@link IteratorType}.
 *
 *  _Note_:
 *  To determine the  smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current smallest element when processing the iterator.
 *  If needed, a different comparator can also be passed as a second argument to {@link min$}
 *  and will then be used to determine the smallest element.
 *
 * @function
 * @template _T_
 * @param { IteratorType<_T_> }     iterator     - a non-empty finite iterator
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERATOR} if the given iterator is empty
 * @example
 * const it = Range(3);
 * const minimum = min$(it);
 * console.log(minimum);
 * // => Logs: 0
 */
const min$ = (iterator, comparator = (a, b) => b < a) => max$(iterator, comparator);