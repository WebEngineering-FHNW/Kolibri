import {map, mconcat } from "../iterator.js";

export { bind }

/**
 * Applies the given function to each element of the {@link IteratorType} and flats it afterward.
 *
 * @Note This operation adds a monadic API to the {@link IteratorType}.
 * @haskell (>>=) :: m a -> (a -> m b) -> m b
 * @template _T_
 * @type {
 *          <_U_>(bindFn: (_T_) => IteratorType<_U_>)
 *          => (it: IteratorType<_T_>)
 *          => IteratorType<_U_>
 * }
 * @example
 * const it     = Range(3);
 * const bindFn = el => take(el)(repeat(el));
 * const result = bind(bindFn)(it);
 * console.log(...result);
 * // => Logs: 1, 2, 2, 3, 3, 3
 */
const bind = bindFn => it =>
  mconcat(
    map(bindFn)(it)
  );