import { Sequence } from "../sequence/Sequence.js";

export { Range, Walk, ALL }

/** A convenience value to use as the highest possible but still reliable upper bound
 * in a long {@link Walk} or extensive {@link Range} over
 * all integral numbers with integral increments.
 * Higher numbers like {@link Number.MAX_VALUE} or {@link Number.POSITIVE_INFINITY}
 * do not always increment to the next Integer reliably.
 * @example
 * const allFromZero = Walk(ALL);
 * const allEven     = Walk(0, ALL, 2);
 * */
const ALL = Number.MAX_SAFE_INTEGER;

/**
 * Creates a range of numbers between two inclusive boundaries,
 * that implements the JS iteration protocol.
 * First and second boundaries can be specified in arbitrary order,
 * step size is always the third parameter.
 * Consider the examples at the end of the documentation.
 *
 * Contract:
 * - End-value may not be reached exactly, but will never be exceeded.
 * - Zero step size leads to infinite loops.
 * - Only values that behave correctly with respect to addition and
 *   size comparison may be passed as arguments.
 *
 * @constructor
 * @pure
 * @haskell (a, a) -> [a]
 * @param { Number? } firstBoundary=ALL - the first boundary of the range, optional with default [@link ALL]
 * @param { Number? } secondBoundary=0  - optionally the second boundary of the range, optional with default 0
 * @param { Number? } step=1            - the size of a step, processed during each iteration, optional with default 1
 * @returns SequenceType<Number>
 *
 * @example
 *  const numbers             = Range();
 *  const range               = Range(3);
 *  const [five, three, one]  = Range(1, 5, -2);
 *  const [three, four, five] = Range(5, 3);
 *
 *  console.log(...range);
 *  // => Logs '0, 1, 2, 3'
 */
const Range = (firstBoundary=ALL, secondBoundary = 0, step = 1) => {
  const stepIsNegative = 0 > step;
  const [left, right]  = normalize(firstBoundary, secondBoundary, stepIsNegative);

  return Sequence(left, value => !hasReachedEnd(stepIsNegative, value, right), value => value + step);
};

/** Walk is an alias for {@link Range} that allows for easier discovery since the name "Range" is also
 * used within the dom API [https://developer.mozilla.org/en-US/docs/Web/API/Range], which
 * undermines the auto-import when typing "Range" for the first time in a file.
 * Just typing "Walk" and using the auto-import will lead to here.
 */
const Walk = Range;

/**
 * Sorts the two parameter a and b by its magnitude.
 * @param  { Number } a
 * @param  { Number } b
 * @returns { [Number, Number] }
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
 * @returns  { boolean }
 */
const hasReachedEnd = (stepIsNegative, next, end) =>
    stepIsNegative ? next < end : next > end;

/**
 * Make sure, that the left and right values
 * are in the proper order according to the given step.
 * @param   { Number }  left
 * @param   { Number }  right
 * @param   { Boolean } stepIsNegative
 * @returns  { [Number, Number] }
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
