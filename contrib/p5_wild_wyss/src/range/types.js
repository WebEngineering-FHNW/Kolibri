/**
 * @typedef RangeType
 * @property  { DropWhile<Number> } dropWhile
 * @property  { TakeWhile<Number> } takeWhile
 * @property  { Drop } drop
 * @property  { Take } take
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
 * @template T
 * @callback TakeWhile
 * @param { Predicate<T> } predicate
 * @returns RangeType
 */

/**
 * @callback Drop
 * @param { Number } count
 * @returns RangeType
 */

/**
 * @callback Take
 * @param { Number } count
 * @returns RangeType
 */