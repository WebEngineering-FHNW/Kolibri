export {Range}

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
 * @param   { Number } next
 * @param   { Number } end
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
const initBoundaries = (from, to, stepIsNegative) => {
  const [min, max] = sort(from, to);
  let next = min;
  let end  = max;
  if (stepIsNegative) {
    next = max;
    end = min;
  }
  return [next, end];
};

/**
 *
 *
 * @constructor
 * @param { Number } from
 * @param { Number } to
 * @param { Number } step
 * @returns {
 *    {
 *      next:   () =>  IteratorResult,
 *      return: () =>  IteratorResult,
 *      [Symbol.iterator](): this
 *    }
 *  }
 *  @example
 *  const [zero, one, two, three] = Range(3);
 *  const [five, three, one]      = Range(1, 5, -2);
 *  const [three, four, five]     = Range(5, 3);
 */
const Range = (from, to = 0, step = 1) => {
  const stepIsNegative  = 0 > step;
  let   done            = false;
  let   [next, end]     = initBoundaries(from, to, stepIsNegative);

  return {
    next: () => {
      if (done) return { done, value: next };

      const tmp = next;
      next += step;

      done = hasReachedEnd(stepIsNegative, next, end)
      return { done: false, value: tmp };
    },
    return: () => {
      done = true;
      return { done, value: next };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
};
