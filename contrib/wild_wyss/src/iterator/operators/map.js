import { nextOf, createIteratorWithArgs } from "../util/util.js";

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
 * const it     = Iterator(0, inc, stop);
 * const mapped = map(el => el * 2)(it);
 */
const map = mapper => iterator => {
  const inner = iterator.copy();
  let mappedValue;

  const next = () => {
    const { done, value } = nextOf(inner);
    if (!done) mappedValue = mapper(value);
    return { done, value: mappedValue }
  };

  return createIteratorWithArgs(next)(map)(mapper)(inner);
};
