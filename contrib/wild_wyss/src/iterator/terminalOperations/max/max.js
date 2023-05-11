import { nextOf }                 from "../../util/util.js";
import { isEmpty }                from "../isEmpty/isEmpty.js";
import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR } from "../../util/errorMessages.js";

export { max$ }

/**
 *  Returns the largest element of a non-empty {@link IteratorType}.
 *  Passing an empty iterator to {@link max$} will throw an error.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current largest element when processing the iterator..
 *  If needed, the comparator can also be passed as a second argument to {@link max$}
 *  and will then be used to determine the largest element.
 *
 * @function
 * @template _T_
 * @template _U_
 * @param { IteratorType<_T_> } iterator
 * @param { BiPredicate<_T_, _U_> } comparator
 * @returns _T_
 * @example
 * const it = Range(3);
 * const maximum = max$(it);
 * console.log(maximum);
 * // => Logs: 3
 */
const max$ = (iterator, comparator = (a, b) => a < b) => {

  if(isEmpty(iterator)) {
    throw Error(ILLEGAL_ARGUMENT_EMPTY_ITERATOR);
  }

  const inner    = iterator.copy();
  let currentMax = nextOf(inner).value;

  for (const elem of inner) {
    if(comparator(currentMax, elem)) {
      currentMax = elem;
    }
  }

  return currentMax;
};