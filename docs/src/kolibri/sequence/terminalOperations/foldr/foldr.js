import { reverse$ } from "../../operators/reverse/reverse.js";

export { foldr$ }

/**
 * Performs a reduction on the elements from right to left, using the provided start value and an accumulation function,
 * and returns the reduced value.
 *
 * _Note:_
 * Since foldr reduces the {@link Iterable} from right to left, it needs O(n) memory to run the function.
 * Therefore {@link reduce$} is the better alternative for most cases
 *
 * @function
 * @pure
 * @haskell foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b
 * @type { <_T_, _U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _T_>, start: _T_)
 *          => (iterable: Iterable<_U_>)
 *          => _T_
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const result  = foldr$((cur, acc) => cur + acc, 0)(numbers);
 *
 * console.log(result);
 * // => Logs '15'
 */
const foldr$ = (accumulationFn, start) => iterable => {
  const inner = reverse$(iterable);
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(current, accumulator);
  }
  return accumulator;
};