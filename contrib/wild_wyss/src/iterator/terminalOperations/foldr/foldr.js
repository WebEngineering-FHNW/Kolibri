export { foldr$ }

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function,
 * and returns the reduced value.
 *
 * @function
 * @pure iterator will be copied defensively
 * @haskell foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b
 * @type {<_T_, _U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _T_>, start: _T_)
 *          => (iterator: IteratorType<_U_>)
 *          => _U_
 *       }
 */
const foldr$ = (accumulationFn, start) => iterator => {
  const inner = iterator.copy();
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(current, accumulator);
  }
  return accumulator;
};

