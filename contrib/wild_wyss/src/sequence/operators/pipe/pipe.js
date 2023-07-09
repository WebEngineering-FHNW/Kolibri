import { toMonadicIterable } from "../../util/sequenceUtil/toMonadicIterable.js";
import { SequencePrototype } from "../../util/sequenceUtil/sequencePrototype.js";

export { pipe }

/**
 * Transforms the given {@link Iterable iterable} using the passed {@link SequenceOperation SequenceOperations}.
 *
 * @function
 * @pure
 * @type  { <_T_>
 *            (...transformers: SequenceOperation<*,*> )
 *            => (iterable: Iterable<_T_>)
 *            => (SequenceType<*> | *)
 *        }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const piped = pipe(
 *                retainAll(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 *              )(numbers);
 *
 * console.log(...piped);
 * // => Logs '0, 4, 8'
 */
const pipe = (...transformers) => iterable => {

  // assure that the iterable is monadic
  if (Object.getPrototypeOf(iterable) !== SequencePrototype) {
   iterable = toMonadicIterable(iterable);
  }

  for (const transformer of transformers) {
    iterable = transformer(iterable);
  }

  return /**@type {SequenceType} */ iterable;
};