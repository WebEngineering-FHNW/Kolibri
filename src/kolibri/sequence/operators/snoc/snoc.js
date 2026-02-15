import { mconcat } from "../mconcat/mconcat.js";
import { Seq }     from "../../constructors/seq/seq.js";

export { snoc }

/**
 * Adds the given element to the end of the {@link Iterable}.
 * @typedef SnocOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell a -> [a] -> [a]
 * @type {
 *           (element: _T_)
 *        => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const snocced = snoc(7)(numbers);
 *
 * console.log(...snocced);
 * // => Logs '0, 1, 2, 3, 7'
 */

/**
 * see {@link SnocOperationType}
 * @template _T_
 * @type { SnocOperationType<_T_> }
 */
const snoc = element => iterable => mconcat( Seq( iterable, Seq(element) ));

