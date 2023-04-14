import { ArrayIterator, cons, dropWhile, Iterator, pipe, reduce$, take, } from "../iterator.js";

export { PrimeNumberIterator }

/**
 * Creates an {@link IteratorType} which generates the sequence of prime numbers.
 *
 * @return { IteratorType<Number> }
 * @constructor
 * @example
 * const iterator = PrimeNumberIterator();
 * console.log(...iterator); // prints: 2, 3, 5, 7, ...
 */
const PrimeNumberIterator = () => {

  const PrimeNumberIteratorFactory = (currentPrime, primes) => {
    const infiniteRange = Iterator(currentPrime, i => i + 1, _ => false);

    const isDivisibleByAnyPrime = candidate => (acc, cur) => acc || candidate % cur === 0;

    const next = () => {
      currentPrime = [...pipe(
        dropWhile(candidate =>
            reduce$(isDivisibleByAnyPrime(candidate), false)(primes)
        ),
        take(1),
      )(infiniteRange)][0];

      primes = cons(currentPrime)(primes);

      return { done: false, value: currentPrime }
      };

    const copy = () => PrimeNumberIteratorFactory(currentPrime, primes.copy());

    return {
      [Symbol.iterator]: () => ({ next }),
      copy
    }
  };

  return PrimeNumberIteratorFactory(2, ArrayIterator([]));
};
