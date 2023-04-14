import { ArrayIterator } from "../iterator.js";

export { reverse$ }

/**
 * Processes the iterator backwards.
 * @template _T_
 * @function
 * @pure iterator will be copied defensively
 * @type {
 *             (iterator: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it       = Iterator(0, inc, stop);
 * const reversed = reverse$(it);
 */
const reverse$ = iterator => {
  const values = [...iterator.copy()].reverse();

  return ArrayIterator(values);
};