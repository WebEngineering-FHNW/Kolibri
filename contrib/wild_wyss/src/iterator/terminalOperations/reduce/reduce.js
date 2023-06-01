export { foldl$, reduce$ }

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 *
 * _Note:_
 * foldl$ is an alias reduce$
 * @function
 * @pure iterator will be copied defensively
 * @haskell foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 * @type {<_T_, _U_>
 *             (accumulationFn: BiFunction<_T_, _U_, _T_>, start: _T_)
 *          => (iterator: Iterable<_T_>)
 *          => _T_
 *       }
 * @example
 * const res = foldl$((acc, cur) => acc + cur, 0)(Range(5));
 * console.log(res);
 * // => logs 15 to the console
 */
const reduce$ = (accumulationFn, start) => iterable => {
  let accumulator = start;
  for (const current of iterable) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};


const foldl$ = reduce$;