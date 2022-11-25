/**
 * @typedef RangeType
 * @property  { DropWhile<Number> } dropWhile
 * @property  { Drop } drop
 * @property {() => { next: () => IteratorResult }} [Symbol.iterator]
 *
 *
 */

/**
 * @template T
 * @callback DropWhile
 * @param { Predicate<T> } predicate
 * @returns RangeType
 */
/**
 * @callback Drop
 * @param { Number } count
 * @returns RangeType
 */