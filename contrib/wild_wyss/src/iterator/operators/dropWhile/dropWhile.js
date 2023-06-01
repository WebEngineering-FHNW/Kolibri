import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { dropWhile }

/**
 * Discards all elements until the first element does not satisfy the predicate anymore.
 *
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const dropped = dropWhile(el => el < 2)(numbers);
 *
 * console.log(...dropped);
 * // Logs => 2, 3, 4, 5
 */
const dropWhile = predicate => iterable => {

  const dropWhileIterator = () => {
    const inner = iteratorOf(iterable);
    const next = () => {
      let { done, value } = inner.next();

      while(!done && predicate(value)) {
        const n = inner.next();
        done    = n.done;
        value   = n.value;
      }

      return { /** @type boolean */ done, value }
    };

   return { next };
  };

  return createMonadicIterable(dropWhileIterator);
};
