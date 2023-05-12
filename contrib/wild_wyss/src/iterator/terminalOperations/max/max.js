import { nextOf }                           from "../../util/util.js";
import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR }  from "../../util/errorMessages.js";

export { max$ }

/**
 *  Returns the largest element of a **non-empty** {@link IteratorType}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current largest element when processing the iterator.
 *  If needed, a different comparator can also be passed as a second argument to {@link max$}
 *  and will then be used to determine the largest element.
 *
 * @function
 * @template _T_
 * @param { IteratorType<_T_> }     iterator     - a non-empty finite iterator
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERATOR} if the given iterator is empty
 * @example
 * const it = Range(3);
 * const maximum = max$(it);
 * console.log(maximum);
 * // => Logs: 3
 */
const max$ = (iterator, comparator = (a, b) => a < b) => {
  const inner                     = iterator.copy();
  let { value: currentMax, done } = nextOf(inner);

  if (done) {
    // iterator is empty, no max can be found
    throw Error(ILLEGAL_ARGUMENT_EMPTY_ITERATOR);
  }

  for (const elem of inner) {
    if (comparator(currentMax, elem)) {
      currentMax = elem;
    }
  }

  return currentMax;
};