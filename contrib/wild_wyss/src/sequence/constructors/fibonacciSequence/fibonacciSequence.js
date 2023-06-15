import { createMonadicSequence } from "../../util/util.js";

export { FibonacciSequence }

/**
 * Generates the Fibonacci sequence.
 *
 * @constructor
 * @pure
 * @returns { SequenceType<Number> }
 *
 * @example
 * const fibonacciNumbers = FibonacciSequence();
 * const result           = take(8)(fibonacciNumbers);
 *
 * console.log(...result);
 * // => Logs '1, 1, 2, 3, 5, 8, 13, 21'
 */
const FibonacciSequence = () => {

  const fibonacciIterator = () => {
    let last = 0;
    let secondLast = 0;

    const next = () => {
      let current = last + secondLast;
      if (current === 0) current = 1;
      secondLast = last;
      last = current;
      return { done: false, value: current };
    };

    return { next };
  };

  return createMonadicSequence(fibonacciIterator);
};