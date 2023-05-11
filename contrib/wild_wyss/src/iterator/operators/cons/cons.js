import { nextOf } from "../../util/util.js";

export { cons }

/**
 * Adds the given element to the front of the iterator.
 * _Note_:
 * Since cons creates a copy of the {@link IteratorType}, it's better to use {@link IteratorBuilderType},
 * if you want to add many elements (more than 100).
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (element: _T_)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it       = Iterator(0, inc, stop);
 * const element  = 1;
 * const iterator = cons(element)(it);
 */
const cons = element => iterator => {
  const inner = iterator.copy();
  let value = element;

  const next = () => {
    if (value !== undefined) {
      value = undefined;
      return { done: false, value: element };
    }
    return nextOf(inner);
  };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy: () => cons(value)(inner)
  }
};