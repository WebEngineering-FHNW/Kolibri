import { SequencePrototype } from "../../util/sequenceUtil/sequencePrototype.js";

export { nil }

/**
 * This constant represents a sequence with no values in it.
 *
 * @constructor
 * @pure
 * @haskell []
 * @template _T_
 * @type { SequenceType<_T_> }
 *
 * @example
 * const emptySequence = nil;
 *
 * console.log(...emptySequence);
 * // => Logs '' (nothing)
 */
const nil = SequencePrototype.empty(); // empty contains the implementation of nil.
Object.setPrototypeOf(nil, SequencePrototype);