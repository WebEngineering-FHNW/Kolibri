import { safeMax$ }                        from "../max/safeMax.js";

export { safeMin$ }

/**
 *  Returns the smallest element of an {@link Iterable}.
 *
 *  _Note_:
 *  To determine the smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link safeMin$}
 *  and will then be used to determine the smallest element.
 *
 * @function
 * @pure
 * @haskell Ord a => [a] -> Maybe a
 * @template _T_
 * @param { Iterable<_T_> } iterable             - a finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns MaybeType<_T_>
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers  = [0, 1, 2, 3];
 * const maybeMin = safeMin$(numbers);
 *
 * maybeMin
 *  (_ => console.log("iterable was empty, no min!")
 *  (x => console.log(x));
 * // => Logs '0'
 */
const safeMin$ = (iterable, comparator = (a, b) => b < a) => safeMax$(iterable, comparator);
