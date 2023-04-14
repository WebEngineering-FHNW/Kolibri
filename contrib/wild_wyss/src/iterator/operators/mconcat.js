import { reduce$ } from "../terminalOperations/terminalOperations.js";
import { ConcatIterator, emptyIterator } from "../constructors/constructors.js";

export { mconcat }

/**
 * @function
 * @template _T_
 * @pure both iterators will be copied defensively
 * @param { IteratorType<IteratorType<_T_>> } iterator -
 * @returns IteratorType<_T_>
 * @example
 * const iterators = ArrayIterator([
 *   Range(2),
 *   Range(2),
 *   Range(2),
 * ]);
 * const result = mconcat(iterators);
 * console.log(...result);
 * // prints: 0, 1, 2, 0, 1, 2, 0, 1, 2
 */
const mconcat = iterator =>
  /**
   * @template _T_
   * @type { IteratorType<_T_> }
   */
  reduce$((acc, cur) => ConcatIterator(acc)(cur), emptyIterator)(iterator);

