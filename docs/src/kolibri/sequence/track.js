
export { Track }

/**
 * A Track constructs an {@link Iterable} from a start value and two functions that determine
 * whether to proceed and how to take the next step.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param   { _T_ }               start    - the first value to be returned (if any)
 * @param   { (_T_) => Boolean }  proceed  - returns true if the iteration should go on, false if it should stop
 * @param   { (_T_) => _T_ }      step     - calculates the next value based on the current one
 * @returns { Iterable<_T_> }
 *
 * @example
 * console.log( ...Track(0, x => x < 3, x => x + 1) );
 * // => Logs '0, 1, 2'
 */

const Track = (start, proceed, step) => {

  const iterate = () => {
    let value = start;                  // use the function closure to store the current value

    const next = () => {
      const current    = value;
      const done       = !proceed(current);
      if (!done) value = step(value);   // store the next value but return the current one
      return { done, value: current };  // IteratorResult
    };

    return { next };                    // Iterator: an object that has a next function
  };

  return { [Symbol.iterator]: iterate }; // Iterable: an object that has an Iterator constructor
};

