import { createMonadicIterable } from "../../util/util.js";

export { FibonaccSequence }

/**
 * Generates the Fibonacci sequence.
 * @returns { IteratorMonadType<Number> }
 * @constructor
 * @example
 * const iterator = FibonaccSequence();
 * const result = take(8)(iterator);
 * console.log(...result); // prints 1, 1, 2, 3, 5, 8, 13, 21 to the console
 */
const FibonaccSequence = () => {

  const Iterator = () => {
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

  return createMonadicIterable(Iterator);
};
