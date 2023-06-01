import { createMonadicIterable } from "../../util/util.js";

export { PureIterator }

/**
 * Creates an {@link IteratorMonadType} which contains just the given value.
 *
 * @template _T_
 * @param { _T_ } value
 * @pure
 * @returns { IteratorMonadType<_T_> }
 * @haskell pure :: a -> [a]
 * @constructor
 * @example
 * const it = PureIterator(1);
 * console.log(...it);
 * // => Logs: 1
 */
const PureIterator = value => {

  const pureIterator = () => {
    let done = false;

    const next = () => {
      const prevDone = done;
      done = true;
      return { done: prevDone, value }
    };

    return { next }
  };

  return createMonadicIterable(pureIterator)
};