
export { Iterator }

// startValue: T, incrementFunction: T => T, stopDetected: T => Boolean
const Iterator = (value, incrementFunction, stopDetected) => {

  const next = () => {
    const current = value;
    const done    = stopDetected(current);
    if (!done) value = incrementFunction(value);

    return { done, value: current };
  };

  return {
    [Symbol.iterator]: () => ({next})
  }
};