import { Iterator } from "../iterator.js";

export { repeat }

/**
 * `repeat` returns an {@link IteratorType} that will repeatedly yield the value of `arg` when iterated over.
 * `repeat` will never be exhausted.
 *
 * @template _T_
 * @param { _T_ } arg
 * @return { IteratorType<_T_> }
 * @example
 * const it = repeat(1);
 * console.log(...take(3)(it));
 * // => Logs 1, 1, 1
 */
const repeat = arg => Iterator(arg, _ => arg, _ => false);