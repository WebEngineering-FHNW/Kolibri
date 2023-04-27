import {
  ArrayIterator,
  map,
  cons,
  cycle,
  Iterator,
  pipe,
  reduce$,
} from "../iterator.js";
import {nextOf} from "../util/util.js";
import {Range} from "../../range/range.js";
import {Just, Nothing} from "../../../../../docs/src/kolibri/stdlib.js";
import {catMaybes} from "../../stdlib/stdlib.js";

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
   * // false, false, true
   */
  const patternForPrime = prime => pipe(
    map(x => x === prime ? Just(prime) : Nothing),
    cycle
  )(Iterator(1, i => i + 1, i => i > prime));

  /**
   * @param { number? } firstPrime -
   * @param {IteratorType<IteratorType<MaybeType<Number, void>>>? } prevPrimes
   * @returns {any}
   * @constructor
   */
  const PrimeNumberFactory = (firstPrime = 2, prevPrimes = ArrayIterator([patternForPrime(firstPrime)])) => {
    let nextValue = firstPrime;

    // copy all primeIterators immediately
    /** @type { IteratorType<IteratorType<MaybeType<Number, void>>> } */
    prevPrimes = ArrayIterator([...prevPrimes.copy()].map(it => it.copy()));

    // TODO: show to DK
    // prevPrimes = map(it => {
    //  console.log("lazy", ...take(4)(it.copy()));
    //  return it.copy();
    // })(prevPrimes);

    // pre calculation starts from firstPrime + 1
    const infinite = Range(nextValue + 1, Number.MAX_VALUE);

    const next = () => {
      const current = nextValue;

      while(true) {
        // pre calculate next value
        nextValue = nextOf(infinite).value;

        const maybeDividers = reduce$((acc, cur) => {
          acc.push( nextOf(cur).value);
          return acc;
        }, [])(prevPrimes);

        const isPrime = catMaybes(maybeDividers).length === 0;

        if (isPrime) {
          prevPrimes = cons(patternForPrime(nextValue))(prevPrimes);
          return { value: current, done: false}
        }
      }
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => PrimeNumberFactory(nextValue, prevPrimes)
    }
  };

  return PrimeNumberFactory();
};