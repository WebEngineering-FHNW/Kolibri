import { createIterator, nextOf } from "./iterator.js";

export { map, filter }

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
