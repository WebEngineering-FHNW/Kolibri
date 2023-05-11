import {
  ArrayIterator,
  map,
  cycle,
  Iterator,
  pipe,
  zipWith
}                         from "../../iterator.js";
import { nextOf }         from "../../util/util.js";
import { Range }          from "../../../range/range.js";
import { Just, Nothing }  from "../../../../../../docs/src/kolibri/stdlib.js";
import { choiceMaybe }    from "../../../stdlib/stdlib.js";
import { uncurry }        from "../../../../../../docs/src/kolibri/lambda/church.js";

export { PrimeNumberIterator }

/**
 * Creates an {@link IteratorType} which generates the sequence of prime numbers.
 *
 * @return { IteratorType<Number> }
 * @constructor
 * @example
 * const iterator = PrimeNumberIterator();
 * console.log(...take(4)(iterator)); // prints: 2, 3, 5, 7
 */
const PrimeNumberIterator = () => {
  /**
   * Creates a repeated sequence pattern for the given prime
   * @param prime
   * @returns {IteratorType<MaybeType>}
   * @example
   * const it = patternForPrime(3);
   * // => Nothing, Nothing, Just(3), ...
   */
  const patternForPrime = prime => pipe(
    map(x => x === prime ? Just(prime) : Nothing),
    cycle
  )(Iterator(1, i => i + 1, i => i > prime));

  const PrimeNumberFactory = (lastPrime = 1, prevPrimes = cycle(ArrayIterator([Nothing]))) => {
    prevPrimes     = prevPrimes.copy(); // defensively copy
    const infinite = Range(lastPrime + 1, Number.MAX_VALUE);

    const next = () => {
      const nextValue  = nextOf(infinite).value;
      const maybePrime = nextOf(prevPrimes).value;

      return maybePrime
        (_ => {
          lastPrime       = nextValue;
          const nextPrime = patternForPrime(nextValue);
          prevPrimes      = zipWith(uncurry(choiceMaybe))
                                (prevPrimes)
                                (nextPrime);
          return { value: nextValue, done: false};
        })      // Nothing, no number found that divides the current number, so it is prime
        (next); // Just, at least one number found, which divides the current number
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => PrimeNumberFactory(lastPrime, prevPrimes)
    }
  };

  return PrimeNumberFactory();
};
