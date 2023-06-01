import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR }  from "../../util/errorMessages.js";
import { safeMax$ }                         from "./safeMax.js";

export { max$ }

/**
 *  Returns the largest element of a **non-empty** {@link Iterable}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterator.
 *  If needed, a different comparator can also be passed as a second argument to {@link max$}
 *  and will then be used to determine the largest element.
 *
 * @function
 * @template _T_
 * @param { Iterable<_T_> }         iterator     - a non-empty finite iterator
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERATOR} if the given iterator is empty
 * @example
 * const numbers = [1, 3, 0, 5];
 * const maximum = max$(numbers);
 *
 * console.log(maximum);
 * // => Logs 5
 */
const max$ = (iterator, comparator = (a, b) => a < b) => {
  let returnVal;
  const maybeResult = safeMax$(iterator, comparator);

  maybeResult
    (_ => { throw Error(ILLEGAL_ARGUMENT_EMPTY_ITERATOR) })
    (x => returnVal = x);

  return returnVal;
};

