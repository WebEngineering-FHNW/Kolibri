import { Range }          from "../../../range/range.js";
import { Just, Nothing }  from "../../../../../../docs/src/kolibri/stdlib.js";
import { choiceMaybe }    from "../../../stdlib/stdlib.js";
import { uncurry }        from "../../../../../../docs/src/kolibri/lambda/church.js";
import {
  createMonadicIterable,
  iteratorOf,
} from "../../util/util.js";
import {
  map,
  cycle,
  Sequence,
  pipe,
  zipWith
} from "../../iterator.js";

export { PrimeNumberSequence }

/**
 * Creates an {@link IteratorMonadType} which generates the sequence of prime numbers.
 *
 * @returns { IteratorMonadType<Number> }
 * @pure
 * @constructor
 * @example
 * const primes = PrimeNumberSequence();
 * console.log(...take(4)(primes));
 * // => Logs 2, 3, 5, 7
 */
const PrimeNumberSequence = () => {
  /**
   * Creates a repeated sequence pattern for the given prime
   * @param prime
   * @returns {IteratorMonadType<MaybeType>}
   * @example
   * const it = patternForPrime(3);
   * // => Nothing, Nothing, Just(3), ...
   */
  const patternForPrime = prime => pipe(
    map(x => x === prime ? Just(prime) : Nothing),
    cycle
  )(Sequence(1, i => i > prime, i => i + 1));

  const primeNumberIterator  = () => {
    let prevPrimesIterator   = iteratorOf(cycle([Nothing]));
    const infiniteIterator   = iteratorOf(Range(2, Number.MAX_VALUE));

    const next = () => {
      const nextValue  = infiniteIterator.next().value;
      const maybePrime = prevPrimesIterator.next().value;

      return maybePrime
        (_ => {
          const prevIterable = createMonadicIterable(() => prevPrimesIterator); // conserve the iterator state of the previous prime
          const nextPrime    = patternForPrime(nextValue);
          const prevPrimes   = zipWith(uncurry(choiceMaybe))
                                 (prevIterable)
                                 (nextPrime);
          prevPrimesIterator = iteratorOf(prevPrimes);

          return { value: nextValue, done: false};
        })      // Nothing, no number found that divides the current number, so it is prime
        (next); // Just, at least one number found, which divides the current number
    };

    return { next };
  };

  return createMonadicIterable(primeNumberIterator);
};
