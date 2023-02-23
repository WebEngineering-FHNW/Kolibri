/**
 * @typedef RangeType
 * @property { RangeFilter }       dropWhile
 * @property { RangeFilter }       takeWhile
 * @property { CountRangeFilter }  drop
 * @property { CountRangeFilter }  take
 * @property { Apply }             forEach
 * @property {() => { next: () => IteratorResult }} [Symbol.iterator]
 */

/**
 * @callback CountRangeFilter
 * @param { Number } n
 * @returns RangeType
 */

/**
 * @callback Apply
 * @param { Consumer<Number> } consume
 */

/**
 * @callback RangeFilter
 * @param  { Predicate<Number> } predicate
 * @return { RangeType }
 */