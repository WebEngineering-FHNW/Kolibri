import { max$ }           from "./max.js";
import {nextOf}           from "../../util/util.js";
import { Just, Nothing }  from "../../../stdlib/maybe.js";

export { safeMax$ }

/**
 *  Returns the largest element of an {@link IteratorType}.
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
 * @param { IteratorType<_T_> }     iterator     - a finite iterator
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns MaybeType<_T_>
 * @example
 * const it = Range(3);
 * const maybeMax = safeMax$(it);
 * maybeMax
 *  (_ => console.log("iterator was empty, no max!")
 *  (x => console.log(x));
 * // => Logs: 3
 */
const safeMax$ = (iterator, comparator = (a, b) => a < b) => {
  const inner = iterator.copy();

  let {
    value: currentMax,
    done: isEmpty
  } = nextOf(inner);

  if (isEmpty) {
    // iterator is empty, no max can be found
    return Nothing;
  }

  for (const elem of inner) {
    if (comparator(currentMax, elem)) {
      currentMax = elem;
    }
  }

  return Just(currentMax);
};
