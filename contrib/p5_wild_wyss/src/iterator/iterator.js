import {id} from "../logger/lamdaCalculus.js";

export { Iterator }


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
 * @callback Increment
 * @param { Object } state
 * @param {_T_} current
 * @returns { state: Object, result: current }
 */

/**
 * @template _T_
 * @param { _T_ }               value
 * @param { (_T_) => _T_ }      incrementFunction
 * @param { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @return { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) =>
  IteratorInternal(id, _ => true, value, incrementFunction, stopDetected);

const ArrayIterator = array =>
  IteratorInternal(x => array[x], _ => true, 0, x => x + 1, x => x === array.length);



const IteratorInternal = (transform, select, value, incrementFunction, stopDetected) => {

  let next = () => {
    const done    = stopDetected(value);
    const current = transform(value);
    value         = incrementFunction(value);
    if (select(current) || done) {
      return { done, value: current };
    } else {
      return next();
    }
  };

  const forEach = consume => {
    for (const elem of iteratorObject) consume(elem);
  };

  const dropWhile = predicate => {
    while (predicate(value) && !stopDetected(value)) next();
    return iteratorObject;
  };

  const drop = count => {
    let i = 0;
    return dropWhile(_ => i++ < count);
  };

  const takeWhile = predicate => {
    const oldDetected = stopDetected;
    stopDetected = value => oldDetected(value) || !predicate(value);
    return iteratorObject;
  };

  const take = count => {
    let i = 0;
    return takeWhile(_ => i++ < count);
  };

  const copy = () => IteratorInternal(transform, select, value, incrementFunction, stopDetected);

  const map = mapper => {
    const oldTransform = transform;
    transform = x => mapper(oldTransform(x));
    return iteratorObject;
  };

  const filter = predicate => {
    const oldSelect = select;
    select = x => predicate(x) && oldSelect(x);

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

  const concat = it => {
    next = () => {
      const current = value;
      const done      = stopDetected(current);
      if(done) return it[Symbol.iterator]().next();
      value = incrementFunction(value);
      return { done, value: current };
    };
    return iteratorObject;
  };

  const cons = a => {
    const it = Iterator(a, _ => undefined, x => x === undefined);
    return it.concat(iteratorObject);
  };

  const head = () => stopDetected(value) ? undefined : value;

  const reverse = () => {
    const values = [...iteratorObject.copy()].reverse();
    return ArrayIterator(values);
  };

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
    copy,
  };

  return iteratorObject;
};
