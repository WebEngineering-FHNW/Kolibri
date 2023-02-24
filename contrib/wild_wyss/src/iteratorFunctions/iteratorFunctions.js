export { map, filter, Iterator, ArrayIterator }

const Iterator = (value, inc, stop) => {

  const next = () => {
    const current = value;
    value = inc(value);
    const done = stop(current);
    return { done, value: current };
  };

  const copy = () => Iterator(value, inc, stop);

  const pipe = (...transformers) => {
    let it = copy();
    for (const transformer of transformers) {
     it = transformer(it);
    }
    return it;
  };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe
  }
};

const ArrayIterator = array => {
  const inner = Iterator(0, x => x + 1, x => x === array.length);
  return ArrayIteratorInternal(array)(inner);
};

const ArrayIteratorInternal = array => inner => {

  const next = () => {
    const { done, value } = nextOf(inner);
    return {
      done,
      value: array[value],
    }
  };

  return createIterator(next)(ArrayIteratorInternal)([array])(inner);
};

const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);


const map = mapper => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const { done, value } = nextOf(inner);
    return {
      done,
      value: mapper(value)
    }
  };

  return createIterator(next)(map)(mapper)(inner);
};

const filter = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = predicate(value) || done;
      return result ? { done, value } : applyFilter(nextOf(inner));
    };
    return applyFilter(nextOf(inner))
  };

  return createIterator(next)(filter)(predicate)(inner);
};

const createIterator = next => iteratorFunction => (...params) => innerIterator => {

  const copy = () => iteratorFunction(...params)(innerIterator.copy());

  const pipe = (...transformers) => {
      let it = copy();
      for (const transformer of transformers) {
        it = transformer(it);
      }
      return it;
    };

  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
    pipe,
  };
};

const nextOf = it => it[Symbol.iterator]().next();