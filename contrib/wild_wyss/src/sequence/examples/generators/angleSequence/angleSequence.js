import { take }  from "../../../operators/take/take.js";
import { Range } from "../../../constructors/range/range.js"

export { AngleSequence }

/**
 * Creates a {@link SequenceType} which generates evenly spaced angles between 0 and 360.
 *
 * @constructor
 * @pure
 * @param { Number } count - the amount of angles to create.
 * @returns { SequenceType<Number> }
 *
 * @example
 * const angles = AngleSequence(4);
 *
 * console.log(...angles);
 * // Logs => '0, 90, 180, 270'
 */
const AngleSequence = count =>
  // since the Range includes the upper boundary, take assures, that the desired number of angles are returned.
  take(count)(Range(0, 360, 360 / count));
