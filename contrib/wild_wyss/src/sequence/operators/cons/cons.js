import { createMonadicSequence, iteratorOf } from "../../util/util.js";

export { cons }

/**
 * Adds the given element to the front of the iterator.
 * _Note_:
 * Since cons creates a copy of the {@link Iterable}, it's better to use {@link SequenceBuilderType},
 * if you want to add many elements (more than 100).
 * @function
 * @template _T_
 * @template _U_
 * @pure iterator will be copied defensively
 * @type {
 *            (element: _T_)
           => SequenceOperation<_T_>
 *       }
 * @example
 * const numbers  = [1, 2, 3];
 * const element  = 0;
 * const consed = cons(element)(numbers);
 *
 * console.log(...consed);
 * // => Logs 0, 1, 2, 3, 4
 */
const cons = element => iterable => {

  const consIterator = () => {
    const inner = iteratorOf(iterable);
    let value   = element;

    const next = () => {
      if (value !== undefined) {
        value = undefined;
        return { done: false, value: element };
      }
      return inner.next();
    };

    return { next };
  };


  return createMonadicSequence(consIterator);
};