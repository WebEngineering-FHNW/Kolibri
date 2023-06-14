import { retainAll } from "../../sequence.js";

export { rejectAll }

/**
 * Only keeps elements which does not fulfill the given {@link Predicate}.
 *
 * @function
 * @pure
 * @template _T_
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 *
 * // reject even numbers
 * const filtered = retainAll(el => el % 2 === 0)(numbers);
 *
 * console.log(...filtered);
 * // => Logs '1, 3, 5'
 */
const rejectAll = predicate => iterable =>
  // flip the predicate and call retainAll
  retainAll(el => !predicate(el))(iterable);
