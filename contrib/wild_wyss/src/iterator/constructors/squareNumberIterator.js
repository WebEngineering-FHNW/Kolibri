import { map } from "../operators/operators.js";
// noinspection ES6PreferShortImport
import { Iterator } from "./constructors.js";

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
  const odds = Iterator(1, i => i + 2, _ => false);
  let result = 0;
  return map(el => {
    result = el + result;
    return result;
  })(odds);
};
