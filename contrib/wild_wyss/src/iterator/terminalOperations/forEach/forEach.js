export { forEach$ }

/**
 * Executes the callback for each element.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (callback: Consumer<_T_>)
 *         => (it: IteratorType<_T_>)
 *         => void
 *       }
 * @example
 * const iterator = newIterator(4);
 * const iterElements = [];
 * forEach$(cur => iterElements.push(cur))(iterator);
 * console.log(iterElements);
 * // => Logs 0, 1, 2, 3, 4
 */
const forEach$ = callback => iterator => {
  for (const current of iterator.copy()) {
    callback(current);
  }
};
