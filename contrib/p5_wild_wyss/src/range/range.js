export { Range }

/**
 * Creates a range of numbers between two inclusive boundaries,
 * that implements the iterator protocol.
 * First and second boundaries can be specified in arbitrary order,
 * step size is always the third parameter.
 * Consider the examples at the end of the documentation.
 *
 * Contract:
 * - End-value may not be reached exactly, but will never be exceeded.
 * - Zero step size leads to infinite loops.
 * - Only values that behave correctly with respect to addition and
 *   size comparison may be passed as arguments.
 * @constructor
 * @param { !Number } firstBoundary  - the first boundary of the range
 * @param { Number }  secondBoundary - optionally the second boundary of the range
 * @param { Number }  step - the size of a step, processed during each iteration
 * @returns RangeType
 * @example
 *  const [zero, one, two, three] = Range(3);
 *  const [five, three, one]      = Range(1, 5, -2);
 *  const [three, four, five]     = Range(5, 3);
 */
const Range = (firstBoundary, secondBoundary = 0, step = 1) => {
  const stepIsNegative  = 0 > step;
  let   done            = false;
  const [left, right]   = normalize(firstBoundary, secondBoundary, stepIsNegative);
  let value = left;

  const next = () => {
    if (done) return { done, value };

    const returnValue = { done: false, value };

    // prepare next iteration
    const nextNumber = value + step;
    done = hasReachedEnd(stepIsNegative, nextNumber, right);
    if (!done) value = nextNumber;

    return returnValue;
  };

  /**
   * Finds the first element which does not match the given predicate.
   * @param  { Predicate<Number> } predicate
   * @return { Number } - the matched element
   */
  const findRangeBoundary = predicate => {
    let current = value;
    while(predicate(current) && current < right) current += step;
    return current;
  };

  /**
   * Drops all elements until an element fulfills the given predicate.
   * @type { RangeFilter }
   * @example
   * Range(10).dropWhile(el => el < 5); // returns Range(5,10)
   */
  const dropWhile = predicate => {
    let start = findRangeBoundary(predicate);
    return Range(start, right, step);
  };

  /**
   * Keeps all elements as long as the passed predicate is true.
   * @type { RangeFilter }
   * @example
   * Range(10).takeWhile(el => el < 5); // returns Range(4)
   */
  const takeWhile = predicate => {
    let end = findRangeBoundary(predicate);
    return Range(left, end, step);
  };

  /**
   * @type { (filterFunction: RangeFilter) => (count: Number) => RangeType }
   */
  const applyCountFilter = filterFunction => count => {
    let i = 0;
    return filterFunction(_ => i++ < count);
  };

  /**
   * Drops the next n elements.
   * @type { CountRangeFilter }
   * @example
   * Range(10).drop(5); // returns Range(5, 10)
   */
  const drop = applyCountFilter(dropWhile);

  /**
   * Keeps the next n elements.
   * @type { CountRangeFilter }
   * @example
   * Range(10).take(5); // returns Range(4)
   */
  const take = applyCountFilter(takeWhile);

  const forEach = consume => {
    const copyRange = Range(value, right, step);
    for(const elem of copyRange) {
      consume(elem);
    }
  };

  return {
    dropWhile,
    takeWhile,
    drop,
    take,
    forEach,
    [Symbol.iterator]: () => ({next})
  };
};

/**
 * Sorts the two parameter a and b by its magnitude.
 * @param  { Number } a
 * @param  { Number } b
 * @return { [Number, Number] }
 */
const sort = (a, b) => {
  if (a < b) return [a,b];
  else return [b,a];
};

/**
 * Determines if the end of the range is reached.
 * @param   { Boolean } stepIsNegative - signals, which range boundary condition is active
 * @param   { Number }  next
 * @param   { Number }  end
 * @return  { boolean }
 */
const hasReachedEnd = (stepIsNegative, next, end) =>
    stepIsNegative ? next < end : next > end;

/**
 * Make sure, that the left and right values
 * are in the proper order according to the given step.
 * @param   { Number }  left
 * @param   { Number }  right
 * @param   { Boolean } stepIsNegative
 * @return  { [Number, Number] }
 */
const normalize = (left, right, stepIsNegative) => {
  const [min, max] = sort(left, right);
  let next = min;
  let end  = max;
  if (stepIsNegative) {
    next = max;
    end = min;
  }
  return [next, end];
};


