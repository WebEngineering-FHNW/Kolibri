export { iteratorOf }


/**
 * Returns the {@link Iterator} of an {@link Iterable}.
 * @template _T_
 * @param { Iterable<_T_> } it
 * @returns Iterator<_T_>
 */
const iteratorOf = it => it[Symbol.iterator]();


