import {createMonadicSequence}     from "../../sequencePrototype.js";
import {catMaybes as arrCatMaybes} from "../../../lambda/maybe.js";
import {iteratorOf}                from "../../util/helpers.js";

export { catMaybes }

/**
 * The catMaybes function takes an {@link Iterable} of {@link MaybeType Maybes}
 * and returns an {@link SequenceType} of all the {@link JustXType Just's} values.
 *
 * @typedef CatMaybesOperationType
 * @function
 * @pure
 * @haskell [Maybe a] -> a
 * @template _T_
 * @type {
              (iterable: Iterable<MaybeType<_T_>>)
 *         => SequenceType<_T_>
 *       }
 *
 * @example
 * const maybes = [Just(5), Just(3), Nothing];
 * const result = catMaybes(maybes);
 *
 * console.log(...result);
 * // => Logs '5, 3'
 */

/**
 * see {@link CatMaybesOperationType}
 * @template _T_
 * @type { CatMaybesOperationType<_T_> }
 */
const catMaybes = iterable => {

  const catMaybesIterator = () =>  {
    const inner = iteratorOf(iterable);

    const next = () => {
      while (true) {
        const { value, done } = inner.next();
        if (done) return { value: undefined, /** @type Boolean */ done };

        const result = arrCatMaybes([value]);
        if (result.length !== 0) {
          return { value: result[0], done: false };
        }
      }
    };

    return { next };
  };

  return createMonadicSequence(catMaybesIterator);
};
