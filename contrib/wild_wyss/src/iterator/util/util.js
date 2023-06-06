import { IteratorPrototype } from "../constructors/iterator/iterator.js";

export { iteratorOf, nextOf, takeWithoutCopy, createIterator, createMonadicIterable}

/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param   { IteratorMonadType<_T_> } it
 * @returns { IteratorResult<_T_, _T_> }
 */
const nextOf = it => it[Symbol.iterator]().next();
/**
 * @template _T_
 * @param { Iterable<_T_> } it
 * @returns Iterator<_T_>
 */
const iteratorOf = it => it[Symbol.iterator]();

/**
 * Works exactly as take, but does not copy the iterator.
 * This is useful to test the functionality without the influence of copy.
 * @template _T_
 * @type {
 *         (n: Number)
 *         => (iterator: IteratorMonadType<_T_>)
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

/**
 *
 * @template _T_
 * @param { () => IteratorResult<_T_, _T_> } next
 * @param { () => IteratorMonadType<_T_> } copy
 * @returns { IteratorMonadType<_T_> }
 */
const createIterator = (next, copy) => {
  const result = {
    [Symbol.iterator]: () => ({ next }),
    copy
  };

  Object.setPrototypeOf(result, IteratorPrototype);
  return /** @type IteratorMonadType */result;

};

/**
 *
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns { IteratorMonadType<_T_> }
 */
const toMonadicIterable = iterable => {
  Object.setPrototypeOf(iterable, IteratorPrototype);
  return /**@type IteratorMonadType*/ iterable;
};

/**
 *
 * @template _T_
 * @param { () => { next: () => IteratorResult<_T_, _T_>} } iterator
 * @returns { IteratorMonadType<_T_> }
 */
const createMonadicIterable = iterator => {
  const result = {[Symbol.iterator]: iterator};
  return toMonadicIterable(result);
};