export { forEach$ }

/**
 * Executes the callback for each element.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (callback: Consumer<_T_>)
 *         => (it: Iterable<_T_>)
 *         => void
 *       }
 * @example
 * const iterator = newIterator(4);
 * const iterElements = [];
 * forEach$(cur => iterElements.push(cur))(iterator);
 * console.log(iterElements);
 * // => Logs 0, 1, 2, 3, 4
 */
const forEach$ = callback => iterable => {
  for (const current of iterable) {
    callback(current);
  }
};
