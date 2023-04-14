export { FibonacciIterator }

/**
 * Generates the Fibonacci sequence.
 * @returns { IteratorType<Number> }
 * @constructor
 * @example
 * const iterator = FibonacciIterator();
 * const result = take(8)(iterator);
 * console.log(...result); // prints 1, 1, 2, 3, 5, 8, 13, 21 to the console
 */
const FibonacciIterator = () => {

  const FibonacciIteratorFactory = (last = 0, secondLast = 0) => {

    const next = () => {
      let current = last + secondLast;
      if (current === 0) current = 1;
      secondLast = last;
      last = current;
      return { done: false, value: current };
    };

    const copy = () => FibonacciIteratorFactory(last, secondLast);

    return {
      [Symbol.iterator]: () => ({ next }),
      copy,
    };
  };

  return FibonacciIteratorFactory();
};
