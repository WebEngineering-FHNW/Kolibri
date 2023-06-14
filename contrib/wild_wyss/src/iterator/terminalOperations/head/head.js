import { iteratorOf } from "../../util/util.js";

export { head }

/**
 * Return the next value without consuming it.
 * @function
 * @template _T_
 * @haskell [a] -> a
 * @pure iterable will not be changed
 * @type {
 *              (iterable: Iterable<_T_>)
 *          =>  _T_
 *       }
 * @example
 * const it     = Sequence(0, inc, stop);
 * const result = head(it);
 */
const head = iterable => {
  const inner = iteratorOf(iterable);
  const { done, value } = inner.next();

  return done ? undefined : value;
};
