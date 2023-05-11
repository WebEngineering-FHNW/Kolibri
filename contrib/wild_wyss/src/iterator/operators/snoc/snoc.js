import {createIterator, nextOf} from "../../util/util.js";

export { snoc }

/**
 * Adds the given element to the end of the iterator.
 * _Note_:
 * Since snoc$ creates a copy of the {@link IteratorType}, it's better to use {@link IteratorBuilderType},
 * if you want to add many elements (more than 100).
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (element: _T_)
 *         => IteratorOperation <_T_>
 *       }
 * @example
 * const it       = Range(3)
 * const iterator = snoc$(element)(7);
 * console.log(...iterator);
 * // => Logs: 0, 1, 2, 3, 7
 *
 */
const snoc = element => iterator => {
  const inner = iterator.copy();
  const value = element;

  const next = () => {
    const current = nextOf(inner);
    if(current.done && element !== undefined) {
      element = undefined;
      return { done: false, value: value}
    }
    return current;
  };
  const copy = () => snoc(element)(inner);

  return createIterator(next, copy);
};