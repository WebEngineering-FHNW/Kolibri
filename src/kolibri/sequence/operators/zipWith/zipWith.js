import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { zipWith }

/**
 * {@link zipWith} generalises {@link zip} by zipping with the function given as the first argument,
 * instead of a Pair constructor.
 * @typedef ZipWithOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell (a -> b -> c) -> [a] -> [b] -> [c]
 * @type { <_U_, _V_>
 *            (zipper: BiFunction<_T_, _U_, _V_>)
 *         => (it1: Iterable<_T_>)
 *         => (it2: Iterable<_U_>)
 *         => SequenceType<_V_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const range   = Range(2, 4);
 * const zipped  = zipWith((i,j) => [i,j])(numbers)(range);
 * console.log(...zipped);
 *
 * // => Logs '[0,2], [1,3], [2,4]'
 */

/**
 * see {@link ZipWithOperationType}
 * @template _T_
 * @type { ZipWithOperationType<_T_> }
 */
const zipWith = zipper => it1 => it2 => {
  /**
   * @template _V_
   * @type _V_
   * */
  let zippedValue;

  const zipWithIterator = () =>  {
    const inner1 = iteratorOf(it1);
    const inner2 = iteratorOf(it2);

    /**
     *
     * @template _V_
     * @returns { IteratorResult<_V_,_V_> }
     */
    const next = () => {
      const { done: done1, value: value1 } = inner1.next();
      const { done: done2, value: value2 } = inner2.next();

      /**@type boolean */
      const done = done1 || done2;

      if (!done) zippedValue = zipper(value1, value2);
      return {
        done:  done,
        value: zippedValue
      };
    };
    return { next };
  };


  return createMonadicSequence(zipWithIterator);
};
