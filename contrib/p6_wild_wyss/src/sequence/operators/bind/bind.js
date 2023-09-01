import { map }     from "../map/map.js";
import { mconcat } from "../mconcat/mconcat.js";

export { bind }

/**
 * Applies the given function to each element of the {@link Iterable} and flats it afterward.
 * @Note This operation adds a monadic API to the {@link SequenceType}.
 *
 * @function
 * @pure
 * @haskell (>>=) :: m a -> (a -> m b) -> m b
 * @template _T_
 * @type {
 *          <_U_>(bindFn: (_T_) => Iterable<_U_>)
 *          => (it: Iterable<_T_>)
 *          => SequenceType<_U_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const bindFn  = el => take(el)(repeat(el));
 * const result  = bind(bindFn)(numbers);
 *
 * console.log(...result);
 * // => Logs '1, 2, 2, 3, 3, 3'
 */
const bind = bindFn => it =>
  mconcat(
    map(bindFn)(it)
  );