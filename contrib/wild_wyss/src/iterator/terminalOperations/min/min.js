import { nextOf }                          from "../../util/util.js";
import { isEmpty }                         from "../isEmpty/isEmpty.js";
import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR } from "../../util/errorMessages.js";

export { min$ }

/**
 *  Returns the smallest element of a non-empty {@link IteratorType}.
 *  Passing an empty iterator to {@link min$} will throw an error.
 *
 *  _Note_:
 *  To determine the  smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current smallest element when processing the iterator.
 *  If needed, the comparator can also be passed as a second argument to {@link min$}
 *  and will then be used to determine the smallest element.
 *
 * @function
 * @template _T_
 * @template _U_
 * @param { IteratorType<_T_> } iterator
 * @param { BiPredicate<_T_, _U_> } comparator
 * @returns _T_
 * @example
 * const it = Range(3);
 * const minimum = min$(it);
 * console.log(minimum);
 * // => Logs: 0
 */
const min$ = (iterator, comparator = (a, b) => b < a) => {

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