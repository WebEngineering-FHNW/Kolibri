import { reduce$ } from "../reduce/reduce.js";

export { count$ }

/**
 * @typedef CountSequenceOperationType
 * @type { () => CountOperationType }
 */
/**
 *  Count the number of elements in a **finite** {@link Iterable}.
 *  The **finite** constraint is indicated by the trailing **$** in the function name.
 *
 *  _Note_:
 *  When erroneously called on an **infinite** iterable, the function **does not return**.
 *  So better be safe and first {@link TakeOperationType take} as many elements as you consider the allowed maximum count.
 *
 *
 * @typedef CountOperationType
 * @function
 * @pure
 * @haskell [a] -> Int
 * @param   { Iterable } iterable - a finite iterable
 * @returns { Number   }
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const count   = count$(numbers);
 *
 * console.log(count);
 * // => Logs '4'
 *
 * const infinite = Sequence(0, forever, id);   // this cannot be counted
 * assert.is(count$( take(10)(infinite) ), 10); // take with upper limit
 */

/**
 * see {@link CountOperationType}
 * @type { CountOperationType }
 */
const count$ = iterable => /** @type { Number } */ reduce$( (acc, _cur) => acc + 1, 0)(iterable);
