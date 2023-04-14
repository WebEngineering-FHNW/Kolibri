import { head } from "./head.js";

export { isEmpty }

// TODO: this implementation does not seem to be correct. an iterator could contain elements after an undefined head. Maybe it would be better to check for the done property
/**
 * Returns true, if the iterators head is undefined.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (iterator: IteratorType<_T_>)
 *         => Boolean
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * const result = isEmpty(it);
 */
const isEmpty = iterator => head(iterator) === undefined;
