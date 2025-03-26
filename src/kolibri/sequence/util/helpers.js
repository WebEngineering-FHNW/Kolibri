import { map }               from "../operators/map/map.js"
import { id }                from "../../stdlib.js"
import { SequencePrototype } from "../sequencePrototype.js";

export { toSeq, isIterable, iteratorOf, ensureSequence, isSequence, forever, plusOp, limit }

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
 * Convenience "plus operator" to be used in reduce situations where the
 * plus operator should be used in a projection.
 * Works with both, strings or numbers.
 * @param  { String | Number | BigInt } acc
 * @param  { String | Number | BigInt } cur
 * @return { String | Number | BigInt }
 * @example
 *   const nums = Seq(1,2,3);
 *   const result  = nums.reduce$( plusOp, 0);
 *   assert.is(result, 6 );
 *   
 *   const strings = "a b c".split(" ");
 *   const string  = strings.reduce( plusOp, "");
 *   assert.is( string, "abc" );
 */
const plusOp = (acc, cur) => acc + cur;

/**
 * Calculate the limit that the number sequence approaches by comparing successive elements until they are
 * less than epsilon apart.
 * Return {@link undefined} if no limit matches the criteria.
 * @WARNING **Might not finish when sequence is infinite and limit cannot be found.**
 * @param { Number }                epsilon
 * @param { SequenceType<Number> }  numberSequence
 * @return { undefined| Number }    the first element with less than epsilon distance from its predecessor
 */
const limit = (epsilon, numberSequence) => {
    let last = numberSequence.head();
    for (const it of numberSequence.drop(1)) {
        if ( Math.abs(last - it) <= epsilon) {
            return it;
        }
        last = it;
    }
    return undefined;
};
