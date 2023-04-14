import { take } from "../operators.js";
import { Range } from "../../range/range.js";

export { AngleIterator }

/**
 * Creates an {@link IteratorType} which generates evenly spaced angles between 0 and 360.
 *
 * @param { Number } count - the number of angles to create.
 * @returns { IteratorType<Number> }
 * @constructor
 * @example
 * const iterator = AngleIterator(4);
 * console.log(...iterator); // prints: 0, 90, 180, 270 to the console
 */
const AngleIterator = count =>
  // since the Range includes the upper boundary, take assures, that the desired number of angles are returned.
  take(count)(Range(0, 360, 360 / count));
