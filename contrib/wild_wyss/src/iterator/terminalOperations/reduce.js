export { reduce$ }

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *             (accumulationFn: BiOperation<_T_>, start: _T_)
 *          => (iterator: IteratorType<_T_>)
 *          => _T_
 *       }
 */
const reduce$ = (accumulationFn, start) => iterator => {
  const inner = iterator.copy();
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};
