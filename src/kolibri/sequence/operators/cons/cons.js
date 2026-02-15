import { append } from "../append/append.js";
import { Seq }    from "../../constructors/seq/seq.js";

export { cons }

/**
 * Adds the given element to the front of an iterable.
 * @typedef ConsOperationType
 * @pure
 * @haskell (:) :: a -> [a] -> [a]
 * @template _T_
 * @type { (element: _T_) => SequenceOperation<_T_> }
 * @example
 * const numbers  = [1, 2, 3];
 * const element  = 0;
 * const consed = cons(element)(numbers);
 *
 * console.log(...consed);
 * // => Logs '0, 1, 2, 3, 4'
 */

/**
 * see {@link ConsOperationType}
 * @template _T_
 * @type { ConsOperationType<_T_> }
 *
 */
const cons = element => append( Seq(element) )  ;
