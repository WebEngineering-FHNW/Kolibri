import { createMonadicIterable, iteratorOf } from "../../util/util.js";

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
 * const it     = Iterator(0, inc, stop);
 * // just keep even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const retainAll = predicate => iterable => {

  const retainAllIterator = () => {
    const inner = iteratorOf(iterable);

    const next = () => {
      while(true) {
        const { done, value } = inner.next();
        const result = done || predicate(value);
        if (result) return { /**@type boolean */done, value } ;
      }
    };
    return { next };
  };

  return createMonadicIterable(retainAllIterator);
};