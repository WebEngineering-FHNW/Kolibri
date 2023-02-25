import { createIterator, nextOf } from "./iterator.js";

export { map, filter }

/**
 * @template _T_
 * @function
 * @pure
 * @type {
 *               (mapper: Functor)
 *            => (iterator: IteratorType)
 *            => IteratorType
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const mapped = map(el => el * 2)(it);
 */
const map = mapper => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const { done, value } = nextOf(inner);
    return {
      done,
      value: mapper(value)
    }
  };

  return createIterator(next)(map)(mapper)(inner);
};

/**
 * @template _T_
 * @function
 * @pure
 * @type {
 *             (predicate: Predicate)
 *          => (iterator: IteratorType)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const mapped = filter(el => el !== 2)(it);
 */
const filter = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = predicate(value) || done;
      return result ? { done, value } : applyFilter(nextOf(inner));
    };
    return applyFilter(nextOf(inner))
  };

  return createIterator(next)(filter)(predicate)(inner);
};
