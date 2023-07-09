import { createMonadicSequence } from "../../util/sequenceUtil/createMonadicSequence.js";

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

const Sequence = (start, whileFunction, incrementFunction) => {

  const iterator = () => {
    let value = start;
    /**
     * @template _T_
     * Returns the next iteration of this iterable object.
     * @returns { IteratorResult<_T_, _T_> }
     */
    const next = () => {
      const current = value;
      const done = !whileFunction(current);
      if (!done) value = incrementFunction(value);
      return { done, value: current };
    };

    return { next };
  };

  return createMonadicSequence(iterator);
};
