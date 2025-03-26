import {iteratorOf} from "../../util/helpers.js";

export { head }

/**
 * Return the next value without consuming it. `undefined` when there is no value.
 * @typedef HeadOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> a
 * @type {
 *              (iterable: Iterable<_T_>)
 *          =>  _T_ | undefined
 *       }
 *
 * @example
 * const numbers = [1, 2, 3, 4];
 * const result  = head(numbers);
 *
 * console.log(result);
 * // => Logs '1'
 */

/**
 * see {@link HeadOperationType}
 * @template _T_
 * @type { HeadOperationType<_T_> }
 */
const head = iterable => {
  const inner = iteratorOf(iterable);
  const { done, value } = inner.next();

  return done ? undefined : value;
};
