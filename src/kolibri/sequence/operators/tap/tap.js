import { map } from "../map/map.js";

export { tap }

/**
 * Executes the callback for each element, leaving the original iterable unchanged other than making it a sequence.
 * @typedef TapOperationType
 * @template _T_
 * @function
 * @impure the whole point of this function is to execute the callback for each element, producing side effects
 * @haskell (a -> IO()) -> [a] -> [a]
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => (iterable: Iterable<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers   = [0, 1, 2, 3, 4];
 * const container = [];
 * tap(cur => container.push(cur))(numbers);
 *
 * console.log(...container);
 * // => Logs '0, 1, 2, 3, 4'
 */
/**
 * see {@link TapOperationType}
 * @template _T_
 * @type {TapOperationType<_T_>}
 */
const tap = callback => map(x => { callback(x); return x; } );
