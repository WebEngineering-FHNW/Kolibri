import { nextOf } from "../util/util.js";

export { zipWith }

/**
 * {@link zipWith ZipWith} generalises {@link zip} by zipping with the function given as the first argument, instead of a {@link pair} constructor.
 * @function
 * @pure both iterators will be copied defensively
 * @template _T_
 * @template _U_
 * @template _V_
 * @type {
 *             (zipper: BiFunction<_T_, _U_, _V_>)
 *          => (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_U_>)
 *          => IteratorType<_V_>
 * }
 * @example
 * const it1 = Range(2);
 * const it2 = Range(2, 4);
 * const zipped = zipWith((i,j) => [i,j])(it1)(it2);
 * console.log(...zipped)1;
 * // prints: [0,2], [1,3], [2,4]
 */
const zipWith = zipper => it1 => it2 => {
  const inner1 = it1.copy();
  const inner2 = it2.copy();
  /**
   * @template _V_
   * @type _V_
   * */
  let zippedValue;

  const next = () => {
    const { done: done1, value: value1 } = nextOf(inner1);
    const { done: done2, value: value2 } = nextOf(inner2);
    const done = done1 || done2;

    if (!done) zippedValue = zipper(value1, value2);

    return {
      done:  done,
      /**
       * @template _V_
       * @type _V_  */
      value: zippedValue
    };
  };

  const copy = () => zipWith(zipper)(inner1)(inner2);
  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};
