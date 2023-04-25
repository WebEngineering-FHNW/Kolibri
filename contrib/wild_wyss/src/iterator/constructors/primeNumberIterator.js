import {
  head,
  ArrayIterator,
  map,
  cons,
  cycle,
  dropWhile,
  Iterator,
  pipe,
  reduce$,
  take,
  reverse$
} from "../iterator.js";
import { Range } from "../../range/range.js";
import {nextOf} from "../util/util.js";

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

  const createPrimeIti = prime => map(x => x === prime)(cycle(Iterator(1, i => i + 1, i => i > prime)));

  const PrimeNumberFactory = (value = 2, prevPrimes = ArrayIterator([createPrimeIti(value)])) => {
    prevPrimes = ArrayIterator([...prevPrimes.copy()].map(it => it.copy()));
      //prevPrimes = map(it => it.copy())(prevPrimes);

    const infinite = Iterator(value + 1, i => i + 1, _ => false);


    const next = () => {
      const current = value;

      let i = 0;
      while(true) {
        if (i++ > 10) return {done: true, value: undefined};

        value = nextOf(infinite).value;
        const isPrime = !reduce$((acc, cur) => nextOf(cur).value || acc, false)(prevPrimes);

        if (isPrime) {
          prevPrimes = cons(createPrimeIti(value))(prevPrimes);
          return { value: current, done: false}
        }
      }
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => {
        return PrimeNumberFactory(value, prevPrimes)
      }
    }
  };

  return PrimeNumberFactory();
};