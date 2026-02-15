import { unfold } from "../unfold/unfold.js";

export { Sequence }

/**
 * The `incrementFunction` should change the value (make progress) in a way that the `whileFunction` function can
 * recognize the end of the sequence.
 *
 * Contract:
 * - `incrementFunction` & `whileFunction` should not refer to any mutable state variable (because of side effect) in
 *   the closure.
 *
 * @constructor
 * @pure if `whileFunction` & `incrementFunction` are pure
 * @template _T_
 * @param   { _T_ }               start             - the first value to be returned by this sequence
 * @param   { (_T_) => Boolean }  whileFunction     - returns false if the iteration should stop
 * @param   { (_T_) => _T_ }      incrementFunction - calculates the next value based on the previous
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const start      = 0;
 * const whileF     = x => x < 3;
 * const incrementF = x => x + 1;
 * const sequence   = Sequence(start, whileF, incrementF);
 *
 * console.log(...sequence);
 * // => Logs '0, 1, 2'
 */

const Sequence = (start, whileFunction, incrementFunction) =>

   unfold(
       start,
       current  => whileFunction(current)
             ? { state: incrementFunction(current), value: current }
             : undefined
   );

