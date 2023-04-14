import { map, Iterator } from "../iterator.js";

export { ArrayIterator }
/**
 * Constructs a new iterator based on the given array. Each iteration returns an element of the given array.
 * @template _T_
 * @param  { Array<_T_> } array
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const ArrayIterator = array =>{
  const internalArray = [...array];
  return map(i => internalArray[i])(Iterator(0, x => x + 1, x => x === internalArray.length));
};
