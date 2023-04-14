export { nextOf }
/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param   { IteratorType<_T_> } it
 * @returns { IteratorResult<_T_, _T_> }
 */
const nextOf = it => it[Symbol.iterator]().next();
