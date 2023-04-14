import { nextOf, createIteratorWithArgs } from "../util/util.js";

export { retainAll }

/**
 * Only keeps elements which fulfill the predicate.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *             (predicate: Predicate<_T_>)
 *          => IteratorOperation<_T_>
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * // just keep even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const retainAll = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = done || predicate(value);
      return result ? { done, value } : applyFilter(nextOf(inner));
    };

    return applyFilter(nextOf(inner))
  };

  return createIteratorWithArgs(next)(retainAll)(predicate)(inner);
};
