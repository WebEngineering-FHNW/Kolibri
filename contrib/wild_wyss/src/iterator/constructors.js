import { pop, emptyStack, stackEquals } from "../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { fst, snd }                     from "../../../../docs/src/kolibri/stdlib.js";
import { convertToJsBool }              from "../logger/lamdaCalculus.js";
import { Range }                        from "../range/range.js";
import { cons, dropWhile, take }        from "./operators.js";
import { reduce$ }                      from "./terminalOperations.js";

export {
  pipe,
  nextOf,
  createIteratorWithArgs,
  createIterator,
  Iterator,
  ArrayIterator,
  TupleIterator,
  ConcatIterator,
  StackIterator,
  emptyIterator,
  FibonacciIterator,
  AngleIterator,
  SquareNumberIterator,
  PrimeNumberIterator,
}

/**
 * Transforms the given {@link IteratorType iterator} using the passed {@link IteratorOperation}
 * @template _T_
 * @type  {
 *               (iterator: IteratorType<_T_>)
 *            => (...transformers: IteratorOperation )
 *            => IteratorType<_T_>
 *        }
 */
const pipe = iterator => (...transformers) => {
  for (const transformer of transformers) {
    iterator = transformer(iterator);
  }
  return iterator;
};


/**
 *
 * The incrementFunction should change the value (make progress) in a way
 * that the isDoneFunction function can recognize the end of the iterator.
 *
 * Contract:
 * - incrementFunction & isDoneFunction should not refer to any mutable
 *   state variable (because of side effect) in the closure.
 *   Otherwise, copying and iterator may not work as expected.
 * - Functions ending with a "$" must not be applied to infinite iterators.
 *
 * @template _T_
 * @param   { _T_ }               value
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  isDoneFunction - returns true if the iteration should stop
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, isDoneFunction) => {
  /**
   * @template _T_
   * Returns the next iteration of this iterable object.
   * @returns { IteratorResult<_T_, _T_> }
   */
  const next = () => {
    const current = value;
    const done = isDoneFunction(current);
    if (!done) value = incrementFunction(value);
    return { done, value: current };
  };

  /**
   * @template _T_
   * Returns a copy of this Constructors
   * @returns {IteratorType<_T_>}
   */
  const copy = () => Iterator(value, incrementFunction, isDoneFunction);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  }
};

/**
 * Constructs a new iterator based on the given array. Each iteration returns an element of the given array.
 * @template _T_
 * @param  { Array<_T_> } array
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const ArrayIterator = array =>{
  const internalArray = [...array];
  return internalMap(i => internalArray[i])(Iterator(0, x => x + 1, x => x === internalArray.length));
};

/**
 * Constructs a new iterator based on the given tuple. Each iteration returns an element of the tuple.
 * @template _T_
 * @param  { (f:ArrayApplierType<_T_>) => any } tuple
 * @return { IteratorType<_T_> }
 * @constructor
 */
const TupleIterator = tuple => {
  // detect number of elements in tuple using a special selector function
  const lengthSelector = arr => arr.length;
  const indexIterator  = Iterator(0, i => i + 1, i => i === tuple(lengthSelector));
  // map over indices and grab corresponding element from tuple
  return internalMap(idx => tuple(values => values[idx]))(indexIterator);
};

/**
 * Adds the second iterator to the first iterators end.
 * @template _T_
 * @pure it1 and it2 will be copied defensively
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @constructor
 * @example
 * const it1 = Constructors(0, inc, stop);
 * const it2 = Constructors(0, inc, stop);
 * const concatIterator = ConcatIterator(it1)(it2);
 */
const ConcatIterator = it1 => it2 => {
  const inner1 = it1.copy();
  const inner2 = it2.copy();
  let fstDone, sndDone = false;

  const next = () => {
    let result;

    // Note: Two separate if statements required, because if `fstDone` changes its state to true,
    //       the second iterator has to be processed. This can not be solved using if else.
    if (!fstDone) {
      result  = nextOf(inner1);
      fstDone = result.done;
    }

    if (fstDone) {
      result  = nextOf(inner2);
      sndDone = result.done;
    }
    return {
      done:  fstDone && sndDone,
      value: result.value
    }
  };

  const copy = () => ConcatIterator(inner1.copy())(inner2.copy());

  return { [Symbol.iterator]: () => ({ next }), copy, };
};

/**
 * Creates an {@link IteratorType} on top of the given {@link stack}
 * @param { stack } stack
 * @template _T_
 * @returns IteratorType<_T_>
 * @constructor
 * @example
 * const stack = push(push(push(emptyStack)(1))(2))(3);
 * const stackIterator = StackIterator(stack);
 * console.log(...stackIterator); // 3, 2, 1
 */
const StackIterator = stack => {
  let internalStack = stack;

  const next = () => {
    const stackTuple  = pop(internalStack);
    const value       = stackTuple(snd);
    const done        = convertToJsBool(stackEquals(emptyStack)(internalStack));
    internalStack     = stackTuple(fst);

    return { value, done }
  };

  const copy = () => StackIterator(internalStack);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  }
};

/**
 * This const represents an iterator with no values in it.
 * @template _T_
 * @type { IteratorType<_T_> }
 */
const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);

/**
 * Helper function to construct a new {@link IteratorType}.
 * This function is mainly used by iterator operations, which return a new iterator (e.g. map).
 *
 * It can be used for operations which take additional arguments (e.g. map, which takes a mapper).
 * For operations which take arguments, please consider {@link createIterator}.
 * @function
 * @template _T_
 * @template _U_
 * @type {
 *            (next: () => IteratorResult<_T_, _T_>)
 *         => (iteratorFunction: (it: IteratorType)
 *         => IteratorOperation<_T_, _U_>)
 *         => (...args: any)
 *         => (inner: IteratorType<_U_>)
 *         => IteratorType<_T_>
 *       }
 */
const createIteratorWithArgs = next => operation => (...args) => innerIterator => {
  const copy = () => operation(...args)(innerIterator);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};

/**
 * Helper function to construct a new {@link IteratorType}.
 * This function is mainly used by iterator operations, which return a new iterator (e.g. map).
 *
 * It can be used for operations which take no additional arguments (e.g. cycle).
 * For operations which take arguments, please consider {@link createIteratorWithArgs}.
 *
 * @function
 * @template _T_
 * @template _U_
 * @type {
 *            (next: () => IteratorResult<_T_, _T_>)
 *         => (iteratorFunction: (it: IteratorType)
 *         => IteratorOperation<_T_, _U_>)
 *         => (inner: IteratorType<_U_>)
 *         => IteratorType<_T_>
 *       }
 */

const createIterator = next => operation => innerIterator => {
  const copy = () => operation(innerIterator);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};

/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param   { IteratorType<_T_> } it
 * @returns { IteratorResult<_T_, _T_> }
 */
const nextOf = it => it[Symbol.iterator]().next();

/**
 * To prevent cycle dependencies, this module defines an own mapping function.
 * @template _T_
 * @template _U_
 * @type {
 *            (mapper: Functor<_U_, _T_>)
 *         => IteratorOperation<_T_>
 *       }
 */
const internalMap = mapper => iterator => {
  const inner = iterator.copy();

  const next = () => {
    let mappedValue;
    const { done, value } = nextOf(inner);
    mappedValue = done ? undefined : mapper(value);
    return { done, value: mappedValue }
    // return { done, value: mapper(value) }
  };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy: () => internalMap(mapper)(inner)
  }
  // return createIteratorWithArgs(next)(internalMap)(mapper)(inner);
};

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

/**
 * Creates an {@link IteratorType} which generates evenly spaced angles between 0 and 360.
 *
 * @param { Number } count - the number of angles to create.
 * @returns { IteratorType<Number> }
 * @constructor
 * @example
 * const iterator = AngleIterator(4);
 * console.log(...iterator); // prints: 0, 90, 180, 270 to the console
 */
const AngleIterator = count =>
  // since the Range includes the upper boundary, take assures, that the desired number of angles are returned.
  take(count)(Range(0, 360, 360 / count));

/**
 * Creates an {@link IteratorType} which generates the sequence of square numbers.
 *
 * @return {IteratorType<Number>}
 * @constructor
 * @example
 * const iterator = take(5)(SquareNumberIterator());
 * console.log(...iterator); // prints: 1, 4, 9, 16, 25
 */
const SquareNumberIterator = () => {
  const odds = Iterator(1, i => i + 2, _ => false);
  let result = 0;
  return internalMap(el => {
    result = el + result;
    return result;
  })(odds);
};

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