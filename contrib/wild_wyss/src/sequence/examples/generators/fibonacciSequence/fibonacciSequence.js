import { Sequence, map } from "../../../sequence.js";
import { Pair }          from "../../../../stdlib/pair.js";

export { FibonacciSequence }

/**
 * Generates the Fibonacci sequence.
 *
 * @constructor
 * @pure
 * @returns { SequenceType<Number> }
 *
 * @example
 * const result = take(8)(FibonacciSequence);
 *
 * console.log(...result);
 * // => Logs '1, 1, 2, 3, 5, 8, 13, 21'
 */
const FibonacciSequence = map(
  ([_, snd]) => snd)
  (Sequence(Pair(0)(1), _ => true, ([fst, snd])=> Pair(snd)(fst + snd))
);