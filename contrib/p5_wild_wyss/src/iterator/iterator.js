

export { Iterator }


/** @typedef  IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult } }            [Symbol.iterator]
 * @property { (callback:Consumer<_T_>)   => void }              forEach   - executes the callback for each element and exhausts the iterator
 * @property { (predicate:Predicate<_T_>) => IteratorType<_T_> } dropWhile - proceed with the iteration where the predicate no longer holds
 * @property { (count:Number)             => IteratorType<_T_> } drop      - jump over so many elements
 * @property { (predicate:Predicate<_T_>) => IteratorType<_T_> } takeWhile - proceed with the iteration until the predicate becomes true
 * @property { (count:Number)             => IteratorType<_T_> } take      - stop after so many elements
 * @property { ()                         => IteratorType<_T_> } copy
 */

/**
 * @template _T_
 * @param { _T_ }               value
 * @param { (_T_) => _T_ }      incrementFunction
 * @param { (_T_) => Boolean }  stopDetected - returns true if the iteration should stop
 * @return { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, stopDetected) => {

  const next = () => {
    const current = value;
    const done    = stopDetected(current);
    if (!done) value = incrementFunction(value);

    return { done, value: current };
  };

  const forEach = consume => {
    for (const elem of iteratorObject) {
      consume(elem);
    }
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

  const copy = () => Iterator(value, incrementFunction, stopDetected);

  const iteratorObject = {
    [Symbol.iterator]: () => ({ next }),
    forEach,
    dropWhile,
    drop,
    takeWhile,
    take,
    copy,
  };

  return iteratorObject;
};
