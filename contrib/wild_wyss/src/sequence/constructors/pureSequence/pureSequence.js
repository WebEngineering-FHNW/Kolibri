import { createMonadicSequence } from "../../util/util.js";

export { PureSequence }

/**
 * Creates a {@link SequenceType} which contains just the given value.
 *
 * @constructor
 * @pure
 * @haskell pure :: a -> [a]
 * @template _T_
 * @param { _T_ } value
 * @returns { SequenceType<_T_> }
 * @example
 * const it = PureSequence(1);
 *
 * console.log(...it);
 * // => Logs '1'
 */
const PureSequence = value => {

  const pureIterator = () => {
    let done = false;

    const next = () => {
      const prevDone = done;
      done = true;
      return { done: prevDone, value }
    };

    return { next }
  };

  return createMonadicSequence(pureIterator)
};