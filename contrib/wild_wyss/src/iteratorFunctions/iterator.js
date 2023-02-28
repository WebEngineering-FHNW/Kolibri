export {
  nextOf,
  createIterator,
  Iterator,
  ArrayIterator,
  TupleIterator,
  emptyIterator,
}

import { map } from "./iteratorFunctions.js"

/**
 * @template _T_
 * @callback CopyType
 * @returns { IteratorType<_T_> }
 */

/**
 * @template _T_
 * @callback PipeType
 * @param   { CopyType } copy
 * @param   { ...* }
 * @returns { IteratorType<_T_> }
 */
const pipe = copy => (...transformers) => {
  let it = copy();
  for (const transformer of transformers) {
    it = transformer(it);
  }
  return it;
};

/** @typedef  IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult } } [Symbol.iterator]
 * @property { CopyType }                             copy
 * @property { (...*) => IteratorType<_T_> }          pipe
 */

/**
 *
 * The incrementFunction should change the value (make progress) in a way that the stopDetected function can recognize
 * the end of the iterator.
 *
 * Contract:
 * - incrementFunction & stopDetected should not refer to any mutable state variable (because of side effect) in the closure.
 *   Otherwise, copying and iterator may not work as expected.
 * - Functions ending with a "$" must not be applied to infinite iterators.
 *
 * @template _T_
 * @param   { _T_ }               value
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @returns { IteratorType<T> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) => {

  const next = () => {
    const current = value;
    const done    = stopDetected(current);
    value         = incrementFunction(value);
    return { done, value: current };
  };

  const copy = () => Iterator(value, incrementFunction, stopDetected);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe: pipe(copy)
  }
};

/**
 * Constructs a new iterator based on the given array. Each iteration returns an element of the given array.
 * @template _T_
 * @param  { Array<_T_> } array
 * @return { IteratorType<_T_> }
 * @constructor
 */
const ArrayIterator = array =>
  map(i => array[i])(Iterator(0, x => x + 1, x => x === array.length));

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
  // TODO: replace Iterator with Range
  const indexIterator  = Iterator(0, i => i + 1, i => i >= tuple(lengthSelector));
  // map over indices and grab corresponding element from tuple
  return map(idx => tuple(values => values[idx]))(indexIterator);
};

/**
 * @template _T_
 * @type { IteratorType<_T_> }
 */
const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);


const createIterator = next => iteratorFunction => (...params) => innerIterator => {
  const copy = () => iteratorFunction(...params)(innerIterator.copy());

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe: pipe(copy)
  };
};

const nextOf = it => it[Symbol.iterator]().next();