import { IteratorPrototype } from "../constructors/iterator/iterator.js";
import { map }               from "../iterator.js"
import { id }                from "../../../../../docs/src/kolibri/stdlib.js"

export {
  isIterable,
  iteratorOf,
  createMonadicIterable,
  toMonadicIterable,
}

/**
 * Checks if a given value is {@link Iterable}.
 * @param { any } value
 * @return { boolean }
 */
const isIterable = value => value && value[Symbol.iterator] !== undefined;

/**
 * Returns the {@link Iterator} of an {@link Iterable}.
 * @template _T_
 * @param { Iterable<_T_> } it
 * @returns Iterator<_T_>
 */
const iteratorOf = it => it[Symbol.iterator]();

/**
 *
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns { IteratorMonadType<_T_> }
 */
const setPrototype = iterable => {
  Object.setPrototypeOf(iterable, IteratorPrototype);
  return /**@type IteratorMonadType*/ iterable;
};

/**
 * Builds an {@link IteratorMonadType} from a given {@link Iterator}.
 * @template _T_
 * @param { () => Iterator<_T_> } iterator
 * @returns { IteratorMonadType<_T_> }
 */
const createMonadicIterable = iterator => {
  const result = {[Symbol.iterator]: iterator};
  return setPrototype(result);
};

/**
 * Casts an arbitrary {@link Iterable} into the {@link IteratorMonadType}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @return { IteratorMonadType<_T_> }
 */
const toMonadicIterable = iterable => map(id)(iterable);