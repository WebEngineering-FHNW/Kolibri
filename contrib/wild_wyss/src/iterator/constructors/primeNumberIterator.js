// noinspection ES6PreferShortImport
import { Iterator }               from "./constructors.js";
import { dropWhile, take, cons }  from "../operators/operators.js";
import { reduce$ }                from "../terminalOperations/terminalOperations.js";
import { ArrayIterator }          from "./constructors.js";

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
      currentPrime = [...pipe(infiniteRange)(
        dropWhile(candidate =>
            reduce$(isDivisibleByAnyPrime(candidate), false)(primes)
        ),
        take(1),
      )][0];

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
