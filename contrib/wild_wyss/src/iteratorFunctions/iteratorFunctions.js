export { map, filter, Iterator }

const Iterator = (value, inc, stop) => {

  const next = () => {
    const current = value;
    value = inc(value);
    const done = stop(current);
    return {done, value:current};
  };

  const copy = () => Iterator(value, inc, stop);

  return {
    [Symbol.iterator]: () => ({ next }),
    copy
  }
};

const map = mapper => iterator => {
  const inner = iterator.copy();
  const next = () => {
    const { done, value } = inner[Symbol.iterator]().next();
    return {
      done,
      value: mapper(value)
    }
  };

  return build(next)(map)(mapper)(inner);
};

const filter = predicate => iterator => {
  const inner = iterator.copy();
  const next = () => {

    const applyFilter  = current => {
      const { done, value } = current;
      const result = predicate(value) || done;
      return result ? { done, value} : applyFilter(n(inner));
    };
    return applyFilter(n(inner))
  };

  return build(next)(filter)(predicate)(inner);
};

const build = next => f => (...g) => it => ({
  [Symbol.iterator]: () => ({ next }),
  copy: () => f(...g)(it.copy())
});


const n = it => it[Symbol.iterator]().next();

const createIterator = next => ({
  [Symbol.iterator] : () =>  ({ next })
});