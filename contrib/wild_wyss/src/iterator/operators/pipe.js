export { pipe }

/**
 * Transforms the given {@link IteratorType iterator} using the passed {@link IteratorOperation}
 * @template _T_
 * @type  {
 *               (iterator: IteratorType<_T_>)
 *            => (...transformers: IteratorOperation )
 *            => IteratorType<_T_>
 *        }
 * @example
 * const piped = pipe(Range(5))(
 *                retainAll(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 * );
 * console.log(...piped);
 * // => Logs 0,4,8
 */
const pipe = iterator => (...transformers) => {
  for (const transformer of transformers) {
    iterator = transformer(iterator);
  }

  return iterator;
};
