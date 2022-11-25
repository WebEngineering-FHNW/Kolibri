export { Range }

/**
 *
 * @constructor
 * @param { Number } firstBoundary
 * @param { Number } secondBoundary
 * @param { Number } step
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
   *
   * @param  { (Number) => Boolean } predicate
   * @return { RangeType }
   */
  const dropWhile = predicate => {
    let current = value;
    while(predicate(current) && current < right) current += step;
    return Range(current, right, step);
  };

  /**
   *
   * @param  { (Number) => Boolean } predicate
   * @return { RangeType }
   */
  const takeWhile = predicate => {
    let current = value;
    while(predicate(current) && current < right) current += step;
    return Range(left, current, step);
  };

  /**
   *
   * @param  { Number } count
   * @return { RangeType }
   */
  const drop = count => {
    let i = 0;
    return dropWhile(_current => i++ < count);
  };

  return {
    dropWhile,
    takeWhile,
    drop,
    [Symbol.iterator]: () => ({next})
  };
};

/**
 *
 * @param  { Number } a
 * @param  { Number } b
 * @return { [Number, Number] }
 */
const sort = (a, b) => {
  if (a < b) return [a,b];
  else return [b,a];
};

/**
 *
 * @param   { Boolean } stepIsNegative
 * @param   { Number }  next
 * @param   { Number }  end
 * @return  { boolean }
 */
const hasReachedEnd = (stepIsNegative, next, end) =>
    stepIsNegative ? next < end : next > end;

/**
 *
 * @param   { Number }  from
 * @param   { Number }  to
 * @param   { Boolean } stepIsNegative
 * @return  { [Number, Number] }
 */
const normalize = (from, to, stepIsNegative) => {
  const [min, max] = sort(from, to);
  let next = min;
  let end  = max;
  if (stepIsNegative) {
    next = max;
    end = min;
  }
  return [next, end];
};


