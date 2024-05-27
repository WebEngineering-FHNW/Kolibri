import { Sequence }         from "../../../../kolibri/sequence/sequence.js";
import { Pair }             from "../../../../kolibri/lambda/pair.js";
import { Th as apply }      from "../../../../kolibri/lambda/ski.js";
import { snd }              from "../../../../kolibri/stdlib.js";

export { SquareNumberSequence }

/**
 * Generates the sequence of square numbers by using the fact that the square of n+1 is
 * the square of n plus 2n+1.
 *
 * @constructor
 * @pure
 * @returns { SequenceType<Number> }
 *
 * @example
 * const squares = SquareNumberSequence();
 * const result  = take(5)(squares);
 *
 * console.log(...result);
 * // => Logs '1, 4, 9, 16, 25'
 */
const SquareNumberSequence = () =>
    Sequence(Pair(1)(1), _ => true, ([num, square]) => Pair (num + 1) (square + num + num + 1) )
    .map( apply(snd) );
