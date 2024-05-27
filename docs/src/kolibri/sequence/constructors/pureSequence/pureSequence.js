import { Seq } from "../seq/seq.js";

export { PureSequence }

/**
 * Creates a {@link SequenceType} which contains just the given value.
 *
 * @constructor
 * @pure
 * @haskell pure :: a -> [a]
 * @template _T_
 * @param   { _T_ } value
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const seq = PureSequence(1);
 *
 * console.log(...seq);
 * // => Logs '1'
 */
const PureSequence = value => Seq(value);
