import {
  isIterable,
  createMonadicIterable,
  iteratorOf
} from "../../util/util.js";

export { toMonadicIterable }

/**
 * Creates an {@link IteratorMonadType} from any {@link Iterable} or {@link Iterable} of {@link Iterable Iterables}.
 *
 * @template _T_
 * @param { _T_ | Iterable<_T_> | Iterable<Iterable<_T_>>} elements -
 * @returns { IteratorMonadType<_T_> }
 * @constructor
 */
const toMonadicIterable = elements => {
  elements = isIterable(elements) ? elements : [elements];
  const iterator = () => {
    let currentIdx = 0;
    let currentIterator = undefined;

    const next = () => {
      while (isIterable(elements[currentIdx])) {
        if (currentIterator === undefined) {
          // process next iterator
          currentIterator = iteratorOf(elements[currentIdx]);
        }

        const result = currentIterator.next();

        if (result.done) {
          currentIterator = undefined;
          currentIdx++;
        } else {
          return result;
        }
      }

      // if all elements of the iterator have been processed
      if (currentIdx === elements.length) {
        return { done: true, value: undefined };
      }

      return { done: false, value: elements[currentIdx++] };
    };

    return { next };
  };

  return createMonadicIterable(iterator);
};
