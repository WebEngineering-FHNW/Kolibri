import { pop, emptyStack, stackEquals } from "../../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { fst, snd }                     from "../../../../../../docs/src/kolibri/stdlib.js";
import { convertToJsBool }              from "../../../logger/lamdaCalculus.js";
import { createMonadicSequence }        from "../../util/sequenceUtil/createMonadicSequence.js";

export { StackSequence }

/**
 * Creates a {@link SequenceType} on top of the given {@link stack}.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param { stack } stack
 * @returns SequenceType<_T_>
 *
 * @example
 * const stack         = push(push(push(emptyStack)(1))(2))(3);
 * const stackSequence = StackSequence(stack);
 *
 * console.log(...stackSequence);
 * // => Logs: '3, 2, 1'
 */
const StackSequence = stack => {

  const stackIterator = () => {
    let internalStack = stack;

    const next = () => {
      const stackTuple  = pop(internalStack);
      const value       = stackTuple(snd);
      const done        = convertToJsBool(stackEquals(emptyStack)(internalStack));
      internalStack     = stackTuple(fst);

      return { value, done }
    };
    return { next };
  };

  return createMonadicSequence(stackIterator);
};