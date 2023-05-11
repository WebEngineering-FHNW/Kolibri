import { Iterator, map } from "../../iterator.js";

export { TupleIterator }

/**
 * Constructs a new iterator based on the given tuple. Each iteration returns an element of the tuple.
 * @template _T_
 * @param  { (f:ArrayApplierType<_T_>) => any } tuple
 * @return { IteratorType<_T_> }
 * @constructor
 * @example
 * const [ Triple ]    = Tuple(3);
 * const triple        = Triple(1)(2)(3);
 * const tupleIterator = TupleIterator(triple);
 * console.log(...tupleIterator);
 * // => Logs: 1, 2, 3
 */
const TupleIterator = tuple => {
  // detect number of elements in tuple using a special selector function
  const lengthSelector = arr => arr.length;
  const indexIterator  = Iterator(0, i => i + 1, i => i === tuple(lengthSelector));
  // map over indices and grab corresponding element from tuple
  return map(idx => tuple(values => values[idx]))(indexIterator);
};
