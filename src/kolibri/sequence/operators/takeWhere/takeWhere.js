import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { takeWhere }

/**
 * Only keeps elements that satisfy the given predicate.
 *
 * @typedef TakeWhereOperationType
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
 * // just keep even numbers
 * const filtered = takeWhere(el => el % 2 === 0)(it);
 *
 * console.log(...filtered);
 * // => Logs '0, 2, 4'
 *
 */

/**
 * see {@link TakeWhereOperationType}
 * @template _T_
 * @type { TakeWhereOperationType<_T_> }
 */
const takeWhere = predicate => iterable => {

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

  return createMonadicSequence(retainAllIterator);
};
