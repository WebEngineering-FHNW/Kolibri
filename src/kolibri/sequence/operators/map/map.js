import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { map }

/**
 * Transforms each element using the given {@link FunctionType function}.
 *
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> [b]
 * @typedef MapOperationType
 * @template _T_
 * @template _U_
 * @type {
 *            (mapper: FunctionType<_T_, _U_>)
 *         => SequenceOperation<_T_, _U_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const mapped  = map(el => el * 2)(numbers);
 *
 * console.log(...numbers);
 * // => Logs '0, 2, 4'
 */

/**
 * see {@link MapOperationType}
 * @template _T_
 * @template _U_
 * @type { MapOperationType<_T_, _U_> }
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
