import { Just, Nothing }                              from "../../../../kolibri/stdlib.js";
import { createMonadicSequence }                      from "../../../../kolibri/sequence/sequencePrototype.js";
import { choiceMaybe }                                from "../../../../kolibri/lambda/maybe.js";
import { uncurry }                                    from "../../../../kolibri/lambda/church.js";
import { cycle, map, pipe, Range, Sequence, zipWith } from "../../../../kolibri/sequence/sequence.js";
import { iteratorOf }                                 from "../../../../kolibri/sequence/util/helpers.js";

export { PrimeNumberSequence }

/**
 * Generates the sequence of prime numbers.
 *
 * @constructor
 * @pure
 * @returns { SequenceType<Number> }
 *
 * @example
 * const primeNumbers = PrimeNumberSequence();
 * const primes       = take(4)(primeNumbers);
 *
 * console.log(...primes);
 * // => Logs '2, 3, 5, 7'
 */
const PrimeNumberSequence = () => {
  /**
   * Creates a repeated sequence pattern for the given prime
   * @param prime
   * @returns { SequenceType<MaybeType<Number>> }
   *
   * @example
   * const seq = patternForPrime(3);
   * const pattern = take(4)(seq);
   *
   * console.log(...seq);
   * // => Logs: 'Nothing, Nothing, Just(3), Nothing'
   */
  const patternForPrime = prime => pipe(
    map(x => x === prime ? Just(prime) : Nothing),
    cycle
  )(Sequence(1, i => i <= prime, i => i + 1));

  const primeNumberIterator = () => {
    let prevPrimesIterator  = iteratorOf(cycle([Nothing]));
    const infiniteIterator  = iteratorOf(Range(2, Number.MAX_VALUE));

    const next = () => {
      const nextValue  = infiniteIterator.next().value;
      const maybePrime = prevPrimesIterator.next().value;

      return maybePrime
        (_ => {
          const prevIterable = createMonadicSequence(() => prevPrimesIterator); // conserve the iterator state of the previous prime
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

  return createMonadicSequence(primeNumberIterator);
};
