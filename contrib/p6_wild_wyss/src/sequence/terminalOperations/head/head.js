import { iteratorOf } from "../../util/sequenceUtil/iteratorOf.js";

export { head }

/**
 * Return the next value without consuming it. `undefined` when there is no value.
 *
 * @function
 * @pure
 * @haskell [a] -> a
 * @template _T_
 * @type {
 *              (iterable: Iterable<_T_>)
 *          =>  _T_
 *       }
 *
 * @example
 * const numbers = [1, 2, 3, 4];
 * const result  = head(numbers);
 *
 * console.log(result);
 * // => Logs '1'
 */
const head = iterable => {
  const inner = iteratorOf(iterable);
  const { done, value } = inner.next();

  return done ? undefined : value;
};