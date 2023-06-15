import { Sequence } from "../../sequence.js";

export { nil }

/**
 * This const represents a sequence with no values in it.
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
 * // => Logs '' nothing to the console
 */
const nil =
  Sequence(undefined, _ => false, _ => undefined);