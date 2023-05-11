import { Iterator }       from "../iterator/iterator.js";
import { createIterator } from "../../util/util.js";

export { PureIterator }

/**
 * Creates an {@link IteratorType} which contains just the given value.
 *
 * @template _T_
 * @param { _T_ } value
 * @returns { IteratorType<_T_> }
 * @haskell pure :: a -> [a]
 * @constructor
 * @example
 * const it = PureIterator(1);
 * console.log(...it);
 * // => Logs: 1
 */
const PureIterator = value => {
    const PureIteratorFactory = done => {
        const inner = Iterator(value, _ => done = true, _ => done);

        const copy = () => PureIteratorFactory(done);
        return createIterator(inner[Symbol.iterator]().next, copy);
    };
    return PureIteratorFactory(false);
};