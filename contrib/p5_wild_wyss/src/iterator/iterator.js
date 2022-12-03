import { id } from "../logger/lamdaCalculus.js";
import {arrayEq} from "../../../../docs/src/kolibri/util/arrayFunctions.js";

export { Iterator, ArrayIterator }


/** @typedef  IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult } }                  [Symbol.iterator]
 * @property { (callback:Consumer<_T_>)         => void }              forEach   - executes the callback for each element and exhausts the iterator
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } dropWhile - proceed with the iteration where the predicate no longer holds
 * @property { (count:Number)                   => IteratorType<_T_> } drop      - jump over so many elements
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } takeWhile - proceed with the iteration until the predicate becomes true
 * @property { (count:Number)                   => IteratorType<_T_> } take      - stop after so many elements
 * @property { ()                               => IteratorType<_T_> } copy      - duplicate the iterator. If the iterators progress depends on a variable in the closure, copy will not work correctly.
 * @property { (mapper:Functor<_T_, *>)         => IteratorType<_T_> } map       - transform each element
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } retainAll - only keep elements which fulfill the predicate
 * @property { (predicate:Predicate<_T_>)       => IteratorType<_T_> } rejectAll - ignore elements which fulfill the predicate
 * @property { (op:BinaryOperation<_T_>, _T_)   => _T_ }               reduce    - Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @property { (it:IteratorType<*>)             => IteratorType<*> }   concat    - add an iterator to the existing iterators end
 * @property { (a:_T_)                          => IteratorType<_T_> } cons      - add the element {@link a} to the front of the iterator
 * @property { ()                               => _T_ }               head      - return the next value without consuming it
 * @property { ()                               => IteratorType<_T_> } reverse   - process the iterator backwards
 */

/**
 * @template _T_
 * @param   { _T_ }               value
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @return  { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) =>
  IteratorInternal(value, incrementFunction, stopDetected, id);

/**
 * @template _T_
 * @param  { Array<_T_> } array
 * @return { IteratorType<_T_> }
 * @constructor
 */
const ArrayIterator = array =>
  IteratorInternal(0, x => x + 1, x => x === array.length,
    ({ done, current, nextValue }) => ({
    done,
    current: array[current],
    nextValue
  }));

/**
 * @template _T_
 * @typedef TransformType
 * @property { Boolean } done
 * @property { any }     current
 * @property { _T_ }     nextValue
 */

/**
 * @template _T_
 * @param  { _T_ } value
 * @param  { (_T_) => _T_ }      incrementFunction
 * @param  { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @param  { UnaryOperation<TransformType<_T_>> } transform
 * @return { IteratorType<_T_>}
 * @constructor
 */
const IteratorInternal = (value, incrementFunction, stopDetected, transform) => {

  const next = () => {
    const {done, current, nextValue} = transform(getNextValue(value));
    if (!done) value = nextValue;

    return {done, value: current}
  };

  /**
   * @template _T_
   * @param  { _T_ } val
   * @return { TransformType<_T_> }
   */
  const getNextValue = val => {
      const current = val;
      const done    = stopDetected(current);
      return { done, current, nextValue: incrementFunction(val) };
  };

  const forEach = consume => {
    for (const elem of iteratorObject) consume(elem);
  };

  const dropWhile = predicate => {
    let { done, current } = transform(getNextValue(value));
    while(predicate(current) && !done) {
      const n = next();
      done    = n.done;
      current = transform(getNextValue(value)).current;
    }
    return iteratorObject;
  };

  const drop = count => {
    let i = 0;
    return dropWhile(_ => i++ < count);
  };

  const takeWhile = predicate => {
    const oldTransform = transform;

    transform = x => {
      const { done, current, nextValue } = oldTransform(x);
      const result = predicate(current) || done;

      if (result) {
        return { done, current, nextValue }
      } else {
        return { done: true, current, nextValue }
      }
    };
    return iteratorObject;
  };

  const take = count => {
    let i = 0;
    return takeWhile(_ => i++ < count);
  };

  const copy = () => IteratorInternal(value, incrementFunction, stopDetected, transform);

  const map = mapper => {
    const oldTransform = transform;
    transform = x => {
      const  { done, current, nextValue } = oldTransform(x);
      return { done, current: mapper(current), nextValue };
    };
    return iteratorObject;
  };

  //TODO: Could be implemented using dropWhile
  const filter = predicate => {
    const oldTransform = transform;
    const applyFilter  = x => {
      const { done, current, nextValue } = oldTransform(x);
      const result = predicate(current) || done;
      return result ? { done, current, nextValue } : applyFilter(getNextValue(nextValue));
    };
    transform = applyFilter;
    return iteratorObject;
  };

  const retainAll = filter;

  const rejectAll = predicate => filter(val => !predicate(val));

  const reduce = (reducer, start) => {
    let accumulator = start;
    for (const current of iteratorObject) {
      accumulator = reducer(accumulator, current);
    }
    return accumulator;
  };

  const concat = it => ArrayIterator([...iteratorObject, ...it]);

  const cons = a => {
    const it = Iterator(a, _ => undefined, x => x === undefined);
    return it.concat(iteratorObject);
  };

  const head = () => stopDetected(value) ? undefined : transform(getNextValue(value)).current;

  const isEmpty = () => head() === undefined;

  const reverse = () => {
    const values = [...iteratorObject.copy()].reverse();
    return ArrayIterator(values);
  };

  const eq = it =>
    arrayEq([...iteratorObject.copy()])([...it.copy()]);


  const iteratorObject = {
    [Symbol.iterator]: () => ({ next }),
    forEach,
    dropWhile,
    drop,
    takeWhile,
    take,
    map,
    retainAll,
    rejectAll,
    reduce,
    cons,
    concat,
    reverse,
    head,
    isEmpty,
    copy,
    eq
  };

  return iteratorObject;
};
