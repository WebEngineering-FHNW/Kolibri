import { pop, emptyStack, stackEquals } from "../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { fst, snd }                     from "../../../../docs/src/kolibri/stdlib.js";
import { convertToJsBool }              from "../logger/lamdaCalculus.js";

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
 * Defines a single operation to decorate an existing {@link IteratorType}.
 *
 * _Note_: Functions of this type must always copy the given iterator.
 * @callback IteratorOperation
 * @template _T_
 * @template _U_
 * @param { IteratorType<_T_> } iterator
 * @returns { IteratorType<_U_>}
 */

/**
 * This type is conform to the JS iteration protocols and can therefore
 * be used in for ... of loops and other syntactical sugar.
 *
 * Furthermore, the Kolibri defines many of functions of type
 * {@link IteratorOperation} which can be used to
 * transform the elements of this Iterator.
 *
 * @typedef IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult<_T_, _T_> } } [Symbol.iterator] - returns the iterator for this object.
 * @property { () => IteratorType<_T_> }                        copy - creates a copy of this {@link IteratorType}
 */

/**
 * Pipe applies the given {@link IteratorOperation} to the iterator it is called on.
 * @callback Pipe
 * @param { ...IteratorOperation<any,any>} it
 * @returns { IteratorType<any> }
 */

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
   * Returns a copy of this Iterator
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
 * @template _T_
 * @callback ArrayApplierType
 * @param Array<_T_>
 * @returns any
 */

/**
 * Constructs a new iterator based on the given tuple. Each iteration returns an element of the given tuple.
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
 * const it1 = Iterator(0, inc, stop);
 * const it2 = Iterator(0, inc, stop);
 * const concatIterator = ConcatIterator(it1)(it2);
 */
const ConcatIterator = it1 => it2 => {
  const inner1 = it1.copy();
  const inner2 = it2.copy();
  let fstDone, sndDone = false;

  const next = () => {
    let result;
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

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
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
  let mappedValue;
  const next = () => {
    const { done, value } = nextOf(inner);
    if(!done) mappedValue = mapper(value);
    return { done, value: mappedValue }
  };

  return createIteratorWithArgs(next)(internalMap)(mapper)(inner);
};