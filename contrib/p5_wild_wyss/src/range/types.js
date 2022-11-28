/**
 * @typedef RangeType
 * @property  { RangeFilter }       dropWhile
 * @property  { RangeFilter }       takeWhile
 * @property  { CountRangeFilter }  drop
 * @property  { CountRangeFilter }  take
 * @property {() => { next: () => IteratorResult }} [Symbol.iterator]
 */

/**
 * @callback CountRangeFilter
 * @param { Number } n
 * @returns RangeType
 */

/**
 * @callback RangeFilter
 * @param  { Predicate<Number> } predicate
 * @return { RangeType }
 */