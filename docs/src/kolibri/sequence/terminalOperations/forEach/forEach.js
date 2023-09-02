export { forEach$ }

/**
 * Executes the callback for each element.
 *
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> Unit
 * @template _T_
 * @type {
 *            (callback: Consumer<_T_>)
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
const forEach$ = callback => iterable => {
  for (const current of iterable) {
    callback(current);
  }
};