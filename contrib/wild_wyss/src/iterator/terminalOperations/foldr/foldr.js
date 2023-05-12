import {reverse$} from "../../operators/reverse/reverse.js";

export { foldr$ }

/**
 * Performs a reduction on the elements from right to left, using the provided start value and an accumulation function,
 * and returns the reduced value.
 *
 * _Note:_
 * Since foldr reduces the {@link IteratorType} from right to left, it needs O(n) memory to run the function.
 * Therefore {@link reduce$} is the better alternative for most cases
 * @function
 * @pure iterator will be copied defensively
 * @haskell foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b
 * @type {<_T_, _U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _T_>, start: _T_)
 *          => (iterator: IteratorType<_U_>)
 *          => _T_
 *       }
 * @example
 * const res = foldr$((cur, acc) => cur + acc, 0)(Range(5));
 * console.log(res);
 * // => logs 15 to the console
 */
const foldr$ = (accumulationFn, start) => iterator => {
  const inner = reverse$(iterator);
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(current, accumulator);
  }
  return accumulator;
};

