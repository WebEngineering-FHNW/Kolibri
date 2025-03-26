import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { mconcat }

/**
 * Monoidal concatenation: flatten an {@link Iterable} of {@link Iterable Iterables} by appending.
 * @typedef MconcatOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [[a]] -> [a]
 * @type {
 *     (seqs: Iterable<Iterable<_T_>>)
 *     => SequenceType<_T_>
 * }
 *
 * @example
 * const ranges = map(x => Range(x))(Range(2));
 * const result = mconcat(ranges);
 *
 * console.log(...result);
 * // => Logs '0, 0, 1, 0, 1, 2'
 */

/**
 * see {@link MconcatOperationType}
 * @template _T_
 * @type { MconcatOperationType<_T_> }
 */
const mconcat = iterable => {

  const mconcatIterator = () => {
    /**
     * @template _T_
     * @type { Iterator<_T_> }
     */
    let current = undefined;
    const outer = iteratorOf(iterable);

    const next = () => {
      while (true) {
        if (current === undefined) {
          // if there is no current, get the next sub iterable of the outer iterable
          const nextOfOuter = outer.next();
          if (nextOfOuter.done) return nextOfOuter;
          current = iteratorOf(nextOfOuter.value);
        }

        // grab next value from sub iterable until it is done
        const nextOfCurrent = current.next();
        if (!nextOfCurrent.done) return nextOfCurrent;

        current = undefined;
      }
    };

    return { next }
  };

  return createMonadicSequence(mconcatIterator);
};
