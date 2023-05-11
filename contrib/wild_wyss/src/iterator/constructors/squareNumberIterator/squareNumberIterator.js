import { Iterator } from "../../iterator.js";
import { nextOf }   from "../../util/util.js";

export { SquareNumberIterator }
/**
 * Creates an {@link IteratorType} which generates the sequence of square numbers.
 *
 * @return {IteratorType<Number>}
 * @constructor
 * @example
 * const iterator = take(5)(SquareNumberIterator());
 * console.log(...iterator); // prints: 1, 4, 9, 16, 25
 */
const SquareNumberIterator = () => {

  const SquareNumberFactory = (odds, prev = 0) => {
   const inner = odds.copy();

    const next = () => {
      prev = prev + nextOf(inner).value;
     return { value: prev, done: false }
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => SquareNumberFactory(inner, prev),
    }
  };

  return SquareNumberFactory(Iterator(1, i => i + 2, _ => false));
};