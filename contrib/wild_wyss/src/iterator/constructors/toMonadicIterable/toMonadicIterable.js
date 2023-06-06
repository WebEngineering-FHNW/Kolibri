export { toMonadicIterable }
import { createMonadicIterable, iteratorOf } from "../../util/util.js";

/**
 *
 * Returns every element of the given JavaScript object.
 * If the passed object is an array, every element of the object is returned.
 * The whole object otherwise.
 * @template _T_
 * @param { ..._T_ | Array<_T_> } elements -
 * @returns { IteratorMonadType<_T_> }
 * @constructor
 */
const toMonadicIterable = (...elements) => {


  // previous implementation
  // const jsonIterator = () => {
  //   const inner = iteratorOf(elements);
  //
  //   const next = () => inner.next();
  //   return { next };
  // };
  // return createMonadicIterable(jsonIterator);

  const internalIterator = () => {
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
        return {done: true, value: undefined};
      }

      return {done: false, value: elements[currentIdx++]};
    };

    return {next};
  };

  return createMonadicIterable(internalIterator);
};


/**
 * checks if a given value is iterable
 * @param { any } value
 * @return { boolean }
 */
const isIterable = value => value && value[Symbol.iterator] !== undefined;
