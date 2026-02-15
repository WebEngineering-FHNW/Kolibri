import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { dropWhile }

/**
 * Discards all elements until the first element does not satisfy the predicate anymore.
 *
 * @template _T_
 * @typedef DropWhileOperationType
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @template _T_
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const dropped = dropWhile(el => el < 2)(numbers);
 *
 * console.log(...dropped);
 * // => Logs '2, 3, 4, 5'
 */
/**
 * see {@link DropWhileOperationType}
 * @template _T_
 * @type { DropWhileOperationType<_T_> }
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

  return createMonadicSequence(dropWhileIterator);
};
