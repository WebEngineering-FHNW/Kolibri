export { foldl$, reduce$ }

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @see foldl$ is an alias for reduce$
 *
 * @function
 * @pure
 * @haskell foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 * @type { <_T_, _U_>
 *             (accumulationFn: BiFunction<_T_, _U_, _T_>, start: _T_)
 *          => (iterable: Iterable<_T_>)
 *          => _T_
 *       }
 *
 * @example
 * const number = [0, 1, 2, 3, 4, 5];
 * const res = foldl$((acc, cur) => acc + cur, 0)(numbers);
 *
 * console.log(res);
 * // => Logs '15'
 */
const reduce$ = (accumulationFn, start) => iterable => {
  let accumulator = start;
  for (const current of iterable) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};

const foldl$ = reduce$;