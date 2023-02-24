export { nextOf, createIterator, Iterator, ArrayIterator, TupleIterator, emptyIterator }

import { map } from "./iteratorFunctions.js"
const pipe = copy => (...transformers) => {
  let it = copy();
  for (const transformer of transformers) {
    it = transformer(it);
  }
  return it;
};

const Iterator = (value, inc, stop) => {

  const next = () => {
    const current = value;
    value = inc(value);
    const done = stop(current);
    return { done, value: current };
  };

  const copy = () => Iterator(value, inc, stop);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe: pipe(copy)
  }
};

const ArrayIterator = array =>
  map(i => array[i])(Iterator(0, x => x + 1, x => x === array.length));

const TupleIterator = tuple => {
  // detect number of elements in tuple using a special selector function
  const lengthSelector = arr => arr.length;
  // TODO: replace Iterator with Range
  const indexIterator  = Iterator(0, i => i + 1, i => i >= tuple(lengthSelector));
  // map over indices and grab corresponding element from tuple
  return map(idx => tuple(values => values[idx]))(indexIterator);
};

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