export {
  nextOf,
  createIterator,
  Iterator,
  ArrayIterator,
  TupleIterator,
  emptyIterator,
}

import { map } from "./iteratorFunctions.js"

// TODO: varargs werden hier nicht von jsdoc erkannt.
/**
 * @template _T_
 * @type  {
 *            (copy: () => IteratorType<_T_>) =>
 *            (transformers: IteratorOperationType ) =>
 *            IteratorType<_T_>
 *        }
 */
const pipe = copy => (...transformers) => {
  let it = copy(); // TODO: muss das hier kopiert werden, theoretisch könnte hier auch ein iterator übergeben werden
  for (const transformer of transformers) {
    it = transformer(it);
  }
  return it;
};

/**
 * Defines a single operation to decorate an existing {@link IteratorType}.
 *
 * _Note_: Functions of this type must always copy the given iterator.
 * @callback IteratorOperationType
 * @template _T_
 * @template _U_
 * @param {IteratorType<_T_>} iterator
 * @returns { IteratorType<_U_>}
 */

/**
 * This type is conform to the JS iteration protocols and can therefore
 * be used in for ... of loops and other syntactical sugar.
 *
 * Furthermore, the Kolibri defines many of functions of type
 * {@link IteratorOperationType} which can be used to
 * transform the elements of this Iterator.
 *
 * @typedef IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult<_T_, _T_> } }       [Symbol.iterator] - returns the iterator for this object.
 * @property { () => IteratorType<_T_> }                              copy - creates a copy of this {@link IteratorType}
 * @property { PipeType }   pipe - transforms this iterator using the passed {@link IteratorOperationType}
 */

/**
 * @callback PipeType
 * @param { ...IteratorOperationType<any,any>} it
 * @returns { IteratorType<any> }
 */

/**
 *
 * The incrementFunction should change the value (make progress) in a way
 * that the stopDetected function can recognize the end of the iterator.
 *
 * Contract:
 * - incrementFunction & stopDetected should not refer to any mutable
 *   state variable (because of side effect) in the closure.
 *   Otherwise, copying and iterator may not work as expected.
 * - Functions ending with a "$" must not be applied to infinite iterators.
 *
 * @template _T_
 * @param   { _T_ }               value
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) => {
  /**
   * @template _T_
   * Returns the next iteration of this iterable object.
   * @returns {IteratorResult<_T_, _T_>}
   */
  const next = () => {
    const current = value;
    const done    = stopDetected(current);
    value         = incrementFunction(value);
    return { done, value: current };
  };

  /**
   * @template _T_
   * Returns a copy of this Iterator
   * @returns {IteratorType<_T_>}
   */
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
 * This const represents an iterator with no values in it.
 * @template _T_
 * @type { IteratorType<_T_> }
 */
const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);

// TODO: varargs werden hier nicht von jsdoc erkannt.
/**
 * Helper function to create a new {@link IteratorType}.
 * @function
 * @template _T_
 * @template _U_
 * @type {
 *  (next: () => IteratorResult<_T_, _T_>) =>
 *  (iteratorFunction: IteratorOperationType<_U_, _T_>) =>
 *  (params: *) =>
 *  (inner: IteratorType<_U_>) =>
 *  IteratorType<_T_>
 * }
 */
const createIterator = next => iteratorFunction => (...params) => innerIterator => {
  const copy = () => iteratorFunction(...params)(innerIterator.copy());

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe: pipe(copy)
  };
};

/**
 * @function
 * @template _T_
 * Convenience function to call the next function of an object which is iterable.
 * @param {IteratorType<_T_>} it
 * @returns {IteratorResult<_T_, _T_>}
 */
const nextOf = it => it[Symbol.iterator]().next();