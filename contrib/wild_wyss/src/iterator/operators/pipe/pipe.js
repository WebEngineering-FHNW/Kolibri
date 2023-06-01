import {iteratorOf} from "../../util/util.js";

export { pipe }

/**
 * Transforms the given {@link Iterable iterable} using the passed {@link IteratorOperation}
 * @type  {<_T_>
 *            (...transformers: IteratorOperation<*,*> )
 *            => (iterator: Iterable<_T_>)
 *            => (IteratorMonadType<_T_> | *)
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
const pipe = (...transformers) => iterable => {
  for (const transformer of transformers) {
    iterable = transformer(iterable);
  }

  return /**@type {IteratorMonadType} */ iterable;
};
