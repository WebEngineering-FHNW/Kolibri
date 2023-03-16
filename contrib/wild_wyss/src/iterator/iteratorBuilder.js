export { IteratorBuilder }
import { emptyIterator, nextOf } from "./iterator.js";

const IteratorBuilder = (start = emptyIterator) => {
  const elements = [start];

  const prepend = (...args) => {
    elements.unshift(...args);
    return builder;
  };

  const append = (...args) => {
    elements.push(...args);
    return builder;
  };

  const build   = () => InternalBuilder(elements);

  const builder = { append, prepend, build };

  return builder;
};

const InternalBuilder = (elements, currentIdx = 0) => {
  let currentIterator = emptyIterator;

  const next = () => {
    // early return, if all elements have been processed
    if (currentIdx === elements.length) return { done: true, value: undefined };

    const value = elements[currentIdx];

    if (!isIterable(value)) {
      currentIdx++;
      return { done: false, value };
    }

    if (currentIterator === emptyIterator) currentIterator = value.copy(); // defensively copy the iterator
    const result = nextOf(currentIterator);

    if (result.done) {
      currentIterator = emptyIterator;
      currentIdx++;
      return next();
    }

    return result;
  };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy: () => InternalBuilder(elements, currentIdx),
  }
};

const isIterable = value => value && value[Symbol.iterator] !== undefined;
