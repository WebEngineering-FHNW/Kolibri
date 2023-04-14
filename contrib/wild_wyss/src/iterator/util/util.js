export { nextOf, takeWithoutCopy }

/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param   { IteratorType<_T_> } it
 * @returns { IteratorResult<_T_, _T_> }
 */
const nextOf = it => it[Symbol.iterator]().next();

/**
 * Works exactly as take, but does not copy the iterator.
 * This is useful to test the functionality without the influence of copy.
 * @template _T_
 * @type {
 *         (n: Number)
 *         => (iterator: IteratorType<_T_>)
 *         => Array<_T_>
 * }
 */
const takeWithoutCopy = n => iterator => {
  const values = [];
  let i = 0;
  for (const element of iterator) {
    values.push(element);
    if (++i === n) break;
  }
  return values;
};

