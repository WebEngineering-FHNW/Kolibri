import { Sequence, map } from "../../../sequence.js";
import { Pair }          from "../../../../stdlib/pair.js";
import { snd }           from "../../../../../../../docs/src/kolibri/stdlib.js";

export { FibonacciSequence }

const start   = Pair(0)(1);
const whileFn =  _ => true;
const incrFn  = ([fst, snd]) => Pair(snd)(fst + snd);
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
const FibonacciSequence = map (pair => pair(snd)) (Sequence(start, whileFn, incrFn));