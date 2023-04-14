import { retainAll } from "../iterator.js";

export { rejectAll }

/**
 * Only keeps elements which fulfill the predicate.
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * // reject even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const rejectAll = predicate => iterator =>
  // flip the predicate and call retainAll
  retainAll(el => !predicate(el))(iterator);
