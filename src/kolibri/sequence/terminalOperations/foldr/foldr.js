import { reverse$ } from "../../operators/reverse/reverse.js";

export { foldr$ }

/**
 * Performs a reduction on the elements from right to left, using the provided start value and an accumulation function,
 * and returns the reduced value.
 *
 * _Must not be called on infinite sequences!_
 *
 * _Note:_ The callback function takes the accumulator as first argument and the current element as second argument
 * as conventional in the JavaScript world. This is different from the Haskell world where the order of the arguments
 * is reversed.
 *
 * _Note:_
 * Since foldr reduces the {@link Iterable} from right to left, it needs O(n) memory to run the function.
 * Therefore {@link reduce$} is the better alternative for most cases
 *
 * @typedef FoldrOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b
 * @type { <_U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _U_>, start: _U_)
 *          => (iterable: Iterable<_T_>)
 *          => _T_
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const result  = foldr$((acc, cur) => cur + acc, 0)(numbers);
 *
 * console.log(result);
 * // => Logs "15"
 */

/**
 * see {@link FoldrOperationType}
 * @template _T_
 * @type { FoldrOperationType<_T_> }
 */
const foldr$ = (accumulationFn, start) => iterable => {
  const inner = reverse$(iterable);
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(accumulator, current);
  }
  return accumulator;
};
