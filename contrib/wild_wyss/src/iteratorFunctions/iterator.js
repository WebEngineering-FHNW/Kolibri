export { nextOf, createIterator, Iterator, ArrayIterator, emptyIterator }

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

const pipe = copy => (...transformers) => {
  let it = copy();
  for (const transformer of transformers) {
    it = transformer(it);
  }
  return it;
};

const nextOf = it => it[Symbol.iterator]().next();