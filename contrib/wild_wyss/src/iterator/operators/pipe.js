export { pipe }

/**
 * Transforms the given {@link IteratorType iterator} using the passed {@link IteratorOperation}
 * @type  {<_T_>
 *            (...transformers: IteratorOperation )
 *            => (iterator: IteratorType<_T_>)
 *            => IteratorType<_T_>
 *        }
 * @example
 * const piped = pipe(
 *                retainAll(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 *              )(Range(5));
 * console.log(...piped);
 * // => Logs 0,4,8
 */
const pipe = (...transformers) => iterator => {
  for (const transformer of transformers) {
    iterator = transformer(iterator);
  }

  return iterator;
};
