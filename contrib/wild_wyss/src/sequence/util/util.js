import { SequencePrototype } from "../constructors/sequence/Sequence.js";
import { map }               from "../sequence.js"
import { id }                from "../../../../../docs/src/kolibri/stdlib.js"

export {
  isIterable,
  iteratorOf,
  createMonadicSequence,
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
 * @returns { SequenceType<_T_> }
 */
const setPrototype = iterable => {
  Object.setPrototypeOf(iterable, SequencePrototype);
  return /**@type SequenceType*/ iterable;
};

/**
 * Builds an {@link SequenceType} from a given {@link Iterator}.
 * @template _T_
 * @param { () => Iterator<_T_> } iterator
 * @returns { SequenceType<_T_> }
 */
const createMonadicSequence = iterator => {
  const result = {[Symbol.iterator]: iterator};
  return setPrototype(result);
};

/**
 * Casts an arbitrary {@link Iterable} into the {@link SequenceType}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @return { SequenceType<_T_> }
 */
const toMonadicIterable = iterable => map(id)(iterable);