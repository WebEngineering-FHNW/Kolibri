import { take }   from "../../iterator.js";
import { Range }  from "../../../range/range.js";

export { AngleSequence }

/**
 * Creates an {@link IteratorMonadType} which generates evenly spaced angles between 0 and 360.
 *
 * @param { Number } count - the number of angles to create.
 * @returns { IteratorMonadType<Number> }
 * @constructor
 * @example
 * const iterator = AngleSequence(4);
 * console.log(...iterator); // prints: 0, 90, 180, 270 to the console
 */
const AngleSequence = count =>
  // since the Range includes the upper boundary, take assures, that the desired number of angles are returned.
  take(count)(Range(0, 360, 360 / count));
