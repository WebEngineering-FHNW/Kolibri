import { SequencePrototype } from "../../util/sequenceUtil/sequencePrototype.js";

export { nil }

const emptySequence = () => {
  const iterator = () => {
    const next = () => ({ done: true, value: undefined });
    return { next }
  };

  return { [Symbol.iterator]: iterator };
};

/**
 * This constant represents a sequence with no values in it.
 *
 * @constructor
 * @pure
 * @haskell []
 * @template _T_
 * @type { SequenceType<_T_> }
 *
 * @example
 * const emptySequence = nil;
 *
 * console.log(...emptySequence);
 * // => Logs '' (nothing)
 */
const nil = SequencePrototype.empty();
Object.setPrototypeOf(nil, SequencePrototype);