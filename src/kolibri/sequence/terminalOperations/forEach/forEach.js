export { forEach$ }
/**
 * @typedef ForEachSequenceOperationType
 * @template _T_
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => void
 *       }
 */
/**
 * Executes the callback for each element and consumes the sequence.
 * Use only on **finite** iterables.
 * @typedef ForEachOperationType
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> Unit
 * @template _T_
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => (it: Iterable<_T_>)
 *         => void
 *       }
 *
 * @example
 * const numbers   = [0, 1, 2, 3, 4];
 * const container = [];
 * forEach$(cur => container.push(cur))(numbers);
 *
 * console.log(...container);
 * // => Logs '0, 1, 2, 3, 4'
 */

/**
 * see {@link ForEachOperationType}
 * @template _T_
 * @type {ForEachOperationType<_T_>}
 */
const forEach$ = callback => iterable => {
  for (const current of iterable) {
    callback(current);
  }
};
