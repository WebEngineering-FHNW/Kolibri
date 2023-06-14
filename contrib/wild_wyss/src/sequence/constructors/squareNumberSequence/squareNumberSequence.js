import { Sequence }                          from "../../sequence.js";
import { createMonadicSequence, iteratorOf } from "../../util/util.js";

export { SquareNumberSequence }
/**
 * Creates a {@link SequenceType} which generates the sequence of square numbers.
 *
 * @constructor
 * @pure
 * @return {SequenceType<Number>}
 * @example
 * const squares = SquareNumberSequence();
 * const result  = take(5)(squares);
 *
 * console.log(...iterator);
 * // => Logs '1, 4, 9, 16, 25'
 */
const SquareNumberSequence = () => {

  const squareNumberIterator = () => {
    const odds  = iteratorOf(Sequence(1, _ => false, i => i + 2));
    let prev    = 0;

    const next = () => {
      prev = prev + odds.next().value;
      return { value: prev, done: false }
    };

    return { next };
  };

  return createMonadicSequence(squareNumberIterator);
};