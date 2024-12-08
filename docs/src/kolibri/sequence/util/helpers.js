import { map }               from "../operators/map/map.js"
import { id }                from "../../stdlib.js"
import { SequencePrototype } from "../sequencePrototype.js";

export { toSeq, isIterable, iteratorOf, ensureSequence, isSequence, forever, plus, count$ }

/**
 * Casts an arbitrary {@link Iterable} into the {@link SequenceType}.
 * The casting is lazy and does not touch (or even exhaust) the iterable.
 * @type { <_T_>  (iterable:Iterable<_T_>) => SequenceType<_T_> }
 */
const toSeq = iterable => map(id)(iterable);

/**
 * Checks whether a given candidate is an {@link Iterable}.
 * @param { any } candidate
 * @return { boolean }
 */
const isIterable = candidate =>
       candidate !== null
    && candidate !== undefined
    && candidate[Symbol.iterator] !== undefined;

/**
 * Returns the {@link Iterator} of an {@link Iterable}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns Iterator<_T_>
 */
const iteratorOf = iterable => iterable[Symbol.iterator]();

/**
 * Checks whether a given candidate is a {@link SequenceType}.
 * @param { any } candidate
 * @return { Boolean } true if the candidate is a {@link SequenceType}, false otherwise
 */
const isSequence = candidate =>
       isIterable(candidate)
    && Object.getPrototypeOf(candidate) === SequencePrototype;

/**
 * Ensures that the given candidate iterable is a {@link SequenceType}.
 * @template _T_
 * @param   { Iterable<_T_> } iterable
 * @returns { SequenceType<_T_> } the input iterable if it is a {@link SequenceType}, otherwise a new {@link SequenceType} wrapping the input iterable
 */
const ensureSequence = iterable =>
    isSequence(iterable)
    ? iterable
    : toSeq(iterable);

/**
 * A convenience constant that can be used when a Sequence is infinite.
 * @type { ConsumingPredicateType<Boolean> }
 */
const forever = _ => true;

/**
 * Convenience function to be used in reduce situations where the
 * plus operation should be used as a projection.
 * Works with both, strings or numbers.
 * @param { String | Number } acc
 * @param { String | Number } cur
 * @return { String | Number }
 * @example
 *   const nums = Seq(1,2,3);
 *   const result  = nums.reduce$( plus, 0);
 *   assert.is(result, 6 );
 *   
 *   const strings = "a b c".split(" ");
 *   const string  = strings.reduce( plus, "");
 *   assert.is( string, "abc" );
 */
const plus = (acc, cur) => acc + cur;

/**
 * Convenience function to count the number of elements in a {@link SequenceType sequence}.
 * @template _T_
 * @param  { SequenceType<_T_> } sequence - must be finite as indicated by the trailing "$"
 * @return { Number } zero or positive integer number
 */
const count$ = sequence => sequence.foldl$( (acc, _cur) => ++acc, 0);
