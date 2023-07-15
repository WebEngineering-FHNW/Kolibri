import { Sequence }              from "../../../sequence.js"
import { iteratorOf }            from "../../../util/sequenceUtil/iteratorOf.js";
import { createMonadicSequence } from "../../../util/sequenceUtil/createMonadicSequence.js";

export { SquareNumberSequence }

/**
 * Generates the sequence of square numbers.
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
const SquareNumberSequence = () => {

  const squareNumberIterator = () => {
    const odds  = iteratorOf(Sequence(1, _ => true, i => i + 2));
    let prev    = 0;

    const next = () => {
      prev = prev + odds.next().value;
      return { value: prev, done: false }
    };

    return { next };
  };

  return createMonadicSequence(squareNumberIterator);
};