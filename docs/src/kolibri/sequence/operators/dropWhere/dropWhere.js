import { takeWhere } from "../takeWhere/takeWhere.js";

export { dropWhere }

/**
 * Only keeps elements which does not fulfil the given predicate.
 * @typedef DropWhereOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 *
 * // reject even numbers
 * const filtered = dropWhere(el => el % 2 === 0)(numbers);
 *
 * console.log(...filtered);
 * // => Logs '1, 3, 5'
*/

/**
 * see {@link DropWhereOperationType}
 * @template _T_
 * @type  { DropWhereOperationType<_T_> }
 */
const dropWhere = predicate => iterable =>
  // flip the predicate and call takeWhere
  takeWhere(el => !predicate(el))(iterable);
