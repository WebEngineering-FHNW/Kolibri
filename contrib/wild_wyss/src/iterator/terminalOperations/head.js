import { nextOf } from "../util/util.js";

export { head }

/**
 * Return the next value without consuming it.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *              (iterator: IteratorType<_T_>)
 *          =>  _T_
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = head(it);
 */
const head = iterator => {
  const inner = iterator.copy();
  const { done, value } = nextOf(inner);

  return done ? undefined : value;
};
