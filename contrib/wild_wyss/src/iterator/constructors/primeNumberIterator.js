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
  const PrimeNumberFactory = (last = undefined) => {
    let currentNumber = 2;
    let prevPrimes = ArrayIterator([]);

    const infinite = Iterator(currentNumber, i => i + 1, _ => false);

    const createPrimeIti = prime =>
      map(x => x === prime)( cycle(Iterator(1, i => i + 1, i => i > prime)));


    const next = () => {
      let i = 0;
      while(true) {
        if (i++ > 10) return {done: true, value: undefined};

        currentNumber = nextOf(infinite).value;
        const isPrime = !reduce$((acc, cur) => nextOf(cur).value || acc, false)(prevPrimes);

        if (isPrime) {
          prevPrimes = cons(createPrimeIti(currentNumber))(prevPrimes);
          return { value: currentNumber, done: false}
        }
      }


    };

    let cnr = 0;
    while(last !== undefined && cnr < last){
      cnr = next().value;
    }
    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => {
        return PrimeNumberFactory(currentNumber)
      }
    }
  };

  return PrimeNumberFactory();
};
