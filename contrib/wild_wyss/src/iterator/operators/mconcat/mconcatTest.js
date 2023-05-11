import { createIterator, nextOf } from "../util/util.js";

export { mconcat }

/**
 * Flatten an {@link IteratorMonadType} of {@link IteratorMonadType IteratorMonadType's}.
 *
 * _Note:_
 * Iterator passed to {@link mconcat} is processed lazily.
 * Therefore, its sub iterators are not copied until these are processed.
 * Otherwise, the passed iterator must be processed eagerly and couldn't contain infinite iterators.
 *
 * @function
 * @template _T_
 * @pure iterator and sub iterators will be copied defensively
 * @param { IteratorMonadType<IteratorMonadType<_T_>> } iterator -
 * @returns IteratorMonadType<_T_>
 * @example
 * const ranges = map(x => Range(x))(Range(2));
 * const result = mconcat(ranges);
 * console.log(...result);
 * // prints: 0, 0, 1, 0, 1, 2
 */
const mconcat = iterator => {

  const mconcatFactory = (outer, current = undefined) => {

    const next = () => {
      while (true) {
        if (current === undefined) {
          // if there is no current, get the next sub iterator of the outer iterator
          const nextOfOuter = nextOf(outer);
          if (nextOfOuter.done) return nextOfOuter;
          current = nextOfOuter.value.copy();
        }
        // grab next iterator value from sub iterator until it is done
        const nextOfCurrent = nextOf(current);
        if (!nextOfCurrent.done) return nextOfCurrent;
        current = undefined;
      }
    };

    const copy = () => {
      const safeCopyCurrent = current === undefined ? current : current.copy();
      return mconcatFactory(outer.copy(), safeCopyCurrent);
    };

    return createIterator(next, copy);
  };
  return mconcatFactory(iterator.copy())

};