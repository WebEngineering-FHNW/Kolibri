import {nextOf} from "../util/util.js";
import {IteratorPrototype} from "../constructors/iterator/iterator.js";


export { Iterator, map, retainAll, reduce$ }


const Iterator = (start, incFn, stopFn) => {
  const fn = () => {
    let nextValue = start;

    const next = () => {
      const current = nextValue;
      const done    = stopFn(current);

      if (!done) nextValue = incFn(nextValue);
      return { done, value: current };
    };

    return { next };
  };

  return createIterator(fn);
};

const createIterator = iterator => {
 const result = {[Symbol.iterator]: iterator};
 Object.setPrototypeOf(result, IteratorPrototype);
 return result;
};



const Iterator2 = (start, incFn, stopFn) => ({

  [Symbol.iterator]: () => {

    let nextValue = start;

    const next = () => {
      const current = nextValue;
      const done    = stopFn(current);

      if (!done) nextValue = incFn(nextValue);
      return { done, value: current };
    };

    return { next };
  }
});

const map = mapper => iterator => ({

  [Symbol.iterator]: () => {
    const inner = iterator[Symbol.iterator]();
    let mappedValue;

    const next = () => {
      const { done, value } = inner.next();
      if(!done) mappedValue = mapper(value);
      return { done, value: mappedValue };
    };

    return { next };
  }
});

const retainAll = predicate => iterator => ({

  [Symbol.iterator]: () => {
    const inner = iterator[Symbol.iterator]();

    const next = () => {
      const applyFilter  = () => {
        const { done, value } = inner.next();
        const result = done || predicate(value);
        return result ? { done, value } : applyFilter();
      };
      return applyFilter();
    };

    return { next };
  }
});

const reduce$ = (accumulationFn, start) => iterator => {

  let accumulator = start;
  for (const current of iterator) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};
