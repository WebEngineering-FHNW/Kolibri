
export { Iterator }

// startValue: T, incrementFunction: T => T, stopDetected: T => Boolean
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

  const iteratorObject = {
    [Symbol.iterator]: () => ({ next }),
    forEach,
    dropWhile,
    drop,
    takeWhile,
    take,
  };

  return iteratorObject;
};