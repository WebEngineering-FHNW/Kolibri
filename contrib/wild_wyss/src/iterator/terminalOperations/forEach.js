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
 */
const forEach$ = callback => iterator => {
  for (const current of iterator.copy()) {
    callback(current);
  }
};
