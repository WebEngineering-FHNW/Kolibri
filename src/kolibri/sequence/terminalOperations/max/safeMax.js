import {Just, Nothing} from "../../../lambda/maybe.js";
import {iteratorOf}    from "../../util/helpers.js";

export { safeMax$ }

/**
 * @typedef SafeMaxOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns MaybeType<_T_>
 */

/**
 *  Returns the largest element of an {@link Iterable}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link safeMax$}
 *  and will then be used to determine the largest element.
 *
 * @typedef SafeMaxOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> Maybe a
 * @param { Iterable<_T_> }         iterable     - a finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns MaybeType<_T_>
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const maybeMax = safeMax$(numbers);
 *
 * maybeMax
 *  (_ => console.log('iterable was empty, no max!')
 *  (x => console.log(x));
 * // => Logs '5'
 */

/**
 * see {@link SafeMaxOperationType}
 * @template _T_
 * @type { SafeMaxOperationType<_T_> }
 */
const safeMax$ = (iterable, comparator = (a, b) => a < b) => {
  const inner = iteratorOf(iterable);

  let {
    value: currentMax,
    done: isEmpty
  } = inner.next();


  if (isEmpty) {
    // iterable is empty, no max can be found
    return Nothing;
  }

  while (!isEmpty) {
    const nextEl = inner.next();
    isEmpty = nextEl.done;

    if (!isEmpty && comparator(currentMax, nextEl.value)) {
      currentMax = nextEl.value;
    }
  }

  return Just(currentMax);
};
