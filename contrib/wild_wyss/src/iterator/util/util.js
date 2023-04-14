export { nextOf, createIterator, createIteratorWithArgs }

/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param   { IteratorType<_T_> } it
 * @returns { IteratorResult<_T_, _T_> }
 */
const nextOf = it => it[Symbol.iterator]().next();

/**
 * Helper function to construct a new {@link IteratorType}.
 * This function is mainly used by iterator operations, which return a new iterator (e.g. map).
 *
 * It can be used for operations which take additional arguments (e.g. map, which takes a mapper).
 * For operations which take arguments, please consider {@link createIterator}.
 * @function
 * @template _T_
 * @template _U_
 * @type {
 *            (next: () => IteratorResult<_T_, _T_>)
 *         => (iteratorFunction: (it: IteratorType)
 *         => IteratorOperation<_T_, _U_>)
 *         => (...args: any)
 *         => (inner: IteratorType<_U_>)
 *         => IteratorType<_T_>
 *       }
 */
const createIteratorWithArgs = next => operation => (...args) => innerIterator => {
  const copy = () => operation(...args)(innerIterator);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};

/**
 * Helper function to construct a new {@link IteratorType}.
 * This function is mainly used by iterator operations, which return a new iterator (e.g. map).
 *
 * It can be used for operations which take no additional arguments (e.g. cycle).
 * For operations which take arguments, please consider {@link createIteratorWithArgs}.
 *
 * @function
 * @template _T_
 * @template _U_
 * @type {
 *            (next: () => IteratorResult<_T_, _T_>)
 *         => (iteratorFunction: (it: IteratorType)
 *         => IteratorOperation<_T_, _U_>)
 *         => (inner: IteratorType<_U_>)
 *         => IteratorType<_T_>
 *       }
 */

const createIterator = next => operation => innerIterator => {
  const copy = () => operation(innerIterator);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};