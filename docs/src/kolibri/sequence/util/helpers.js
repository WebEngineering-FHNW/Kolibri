import { map } from "../operators/map/map.js"
import { id }  from "../../stdlib.js"

export { toSeq, isIterable, iteratorOf_ }

/**
 * Casts an arbitrary {@link Iterable} into the {@link SequenceType}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @return { SequenceType<_T_> }
 */
const toSeq = iterable => map(id)(iterable);

/**
 * Checks if a given value is an {@link Iterable}.
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
const iteratorOf_ = it => it[Symbol.iterator]();
