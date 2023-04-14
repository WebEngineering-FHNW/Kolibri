import { nextOf } from "../util/util.js";

export { cycle }

/**
 * {@link cycle Cycle} ties a finite {@link IteratorType} into a circular one, or equivalently, the infinite repetition of the original {@link IteratorType}.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @param { IteratorType<_T_> } iterator
 * @returns IteratorType<_T_>
 * @example
 * const it     = Range(2);
 * const cycled = cycle(it);
 * console.log(take(6)(cycled));
 * // prints: 0, 1, 2, 0, 1, 2
 */
const cycle = iterator => {

  // cycleFactory is used to create a proper copy and makes sure the following points:
  // - continue from the current value of the underlying iterator (and not from the first value of the origin iterator)
  // - that the iterator works on the full range of the original iterator when the next cycle begins
  const cycleFactory = original => current => {

    const origin  = original.copy();
    let inner     = current.copy();

    const next = () => {
      const result = nextOf(inner);
      if (!result.done) return result;

      inner = origin.copy();
      return nextOf(inner);
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => cycleFactory(origin)(inner),
    }
  };

  return cycleFactory(iterator)(iterator);
};
