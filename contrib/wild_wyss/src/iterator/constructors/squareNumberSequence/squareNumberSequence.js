import { Sequence }                          from "../../iterator.js";
import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { SquareNumberSequence }
/**
 * Creates an {@link Iterable} which generates the sequence of square numbers.
 *
 * @return {Iterable<Number>}
 * @constructor
 * @example
 * const squares = take(5)(SquareNumberSequence());
 * console.log(...iterator);
 * // => Logs 1, 4, 9, 16, 25
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

  return createMonadicIterable(squareNumberIterator);
};