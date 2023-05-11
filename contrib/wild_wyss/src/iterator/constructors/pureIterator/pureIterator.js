import {Iterator} from "../iterator/iterator.js";

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
        const inner =  Iterator(value, _ => done = true, _ => done);

        return {
            [Symbol.iterator]: inner[Symbol.iterator] ,
            copy: () => PureIteratorFactory(done)
        }
    };
    return PureIteratorFactory(false);
};