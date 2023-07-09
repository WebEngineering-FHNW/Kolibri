import { iteratorOf }            from "../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

export { map }

/**
 * Transforms each element using the given {@link Functor function}.
 *
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> [b]
 * @template _T_
 * @template _U_
 * @type {
 *            (mapper: Functor<_U_, _T_>)
 *         => SequenceOperation<_U_, _T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const mapped  = map(el => el * 2)(numbers);
 *
 * console.log(...numbers);
 * // => Logs '0, 2, 4'
 */
const map = mapper => iterable => {

  const mapIterator = () => {
    const inner = iteratorOf(iterable);
    let mappedValue;

    const next = () => {
      const { done, value } = inner.next();
      if (!done) mappedValue = mapper(value);

      return { /**@type boolean */ done, value: mappedValue }
    };

    return { next };
  };

  return createMonadicSequence(mapIterator);
};