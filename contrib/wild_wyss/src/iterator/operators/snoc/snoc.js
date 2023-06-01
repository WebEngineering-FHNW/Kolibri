import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { snoc }

/**
 * Adds the given element to the end of the iterator.
 * _Note_:
 * Since snoc creates a copy of the {@link Iterable}, it's better to use {@link IteratorBuilderType},
 * if you want to add many elements (more than 100).
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (element: _T_)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const numbers = [0, 1, 2, 3];
 * const snocced = snoc(element)(7);
 *
 * console.log(...snocced);
 * // => Logs 0, 1, 2, 3, 7
 *
 */
const snoc = element => iterable => {
  const snocIterator = () => {
    let last = element;
    const inner = iteratorOf(iterable);

    const next = () => {
      const current = inner.next();
      if (current.done && last !== undefined) {
        const value = element;
        last = undefined;
        return { done: false, value: value }
      }
      return current;
    };

    return { next };
  };

  return createMonadicIterable(snocIterator);
};