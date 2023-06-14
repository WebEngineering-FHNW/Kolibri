import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { map }

/**
 * Transforms each element using the given function.
 * @function
 * @template _T_
 * @template _U_
 * @pure iterator will be copied defensively
 * @type {
 *            (mapper: Functor<_U_, _T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const numbers = [0, 1, 2];
 * const mapped  = map(el => el * 2)(numbers);
 *
 * console.log(...numbers);
 * // => Logs 0, 2, 4
 */
const map = mapper => iterator => {

  const mapIterator = () => {
    const inner = iteratorOf(iterator);
    let mappedValue;

    const next = () => {
      const { done, value } = inner.next();
      if (!done) mappedValue = mapper(value);

      return { /**@type boolean */ done, value: mappedValue }
    };

    return { next };
  };

  return createMonadicIterable(mapIterator);
};
