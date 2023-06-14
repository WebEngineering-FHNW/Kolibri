import { Sequence, map }                     from "../../sequence.js";
import { createMonadicSequence, iteratorOf } from "../../util/util.js";

export { TupleSequence }

/**
 * Constructs a new iterator based on the given tuple. Each iteration returns an element of the tuple.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param  { (f:ArrayApplierType<_T_>) => any } tuple
 * @returns { SequenceType<_T_> }
 * @example
 * const [Triple]      = Tuple(3);
 * const triple        = Triple(1)(2)(3);
 * const tupleIterator = TupleSequence(triple);
 *
 * console.log(...tupleIterator);
 * // => Logs '1, 2, 3'
 */
const TupleSequence = tuple => {
  // detect number of elements in tuple using a special selector function
  const lengthSelector = arr => arr.length;
  const indexIterator  = Sequence(0, i => i === tuple(lengthSelector), i => i + 1);

  const tupleIterator = () => {
    // map over indices and grab corresponding element from tuple
    const innerIterator = iteratorOf(map(idx => tuple(values => values[idx]))(indexIterator));
    return { next : innerIterator.next }
  };

  return createMonadicSequence(tupleIterator);
};