export { pipe }

/**
 * Transforms the given {@link IteratorType iterator} using the passed {@link IteratorOperation}
 * @template _T_
 * @type  {
 *               (iterator: IteratorType<_T_>)
 *            => (...transformers: IteratorOperation )
 *            => IteratorType<_T_>
 *        }
 */
const pipe = iterator => (...transformers) => {
  for (const transformer of transformers) {
    iterator = transformer(iterator);
  }
  return iterator;
};
