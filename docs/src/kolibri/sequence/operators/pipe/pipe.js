import { ensureSequence } from "../../util/helpers.js";

export { pipe }

/**
 * Transforms the given {@link Iterable} by applying each transformer's {@link SequenceOperation}
 * from begin to end while passing through the intermediate results.
 * @typedef PipeOperationType
 * @template _T_
 * @type  {
 *            (...transformers: SequenceOperation<*,*> )
 *            => (iterable: Iterable<_T_>)
 *            => (SequenceType<*> | *)
 *        }
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const piped = pipe(
 *                takeWhere(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 *              )(numbers);
 *
 * console.log(...piped);
 * // => Logs '0, 4, 8'
 */

/**
 * see {@link PipeOperationType}
 * @template _T_
 * @type  { PipeOperationType<_T_> }
 */
const pipe = (...transformers) => iterable => {

  iterable = ensureSequence(iterable);

  for (const transformer of transformers) {
    iterable = transformer(iterable);
  }

  return  iterable;
};
