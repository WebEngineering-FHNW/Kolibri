import { Iterator }                          from "../../iterator.js";
import { createMonadicIterable, iteratorOf } from "../../util/util.js";

export { SquareNumberIterator }
/**
 * Creates an {@link Iterable} which generates the sequence of square numbers.
 *
 * @return {Iterable<Number>}
 * @constructor
 * @example
 * const squares = take(5)(SquareNumberIterator());
 * console.log(...iterator);
 * // => Logs 1, 4, 9, 16, 25
 */
const SquareNumberIterator = () => {

  const squareNumberIterator = () => {
    const odds  = iteratorOf(Iterator(1, i => i + 2, _ => false));
    let prev    = 0;

    const next = () => {
      prev = prev + odds.next().value;
      return { value: prev, done: false }
    };

    return { next };
  };

  return createMonadicIterable(squareNumberIterator);
};