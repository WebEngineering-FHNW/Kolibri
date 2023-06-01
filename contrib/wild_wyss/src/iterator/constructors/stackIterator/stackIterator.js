import { pop, emptyStack, stackEquals } from "../../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { fst, snd }                     from "../../../../../../docs/src/kolibri/stdlib.js";
import { convertToJsBool }              from "../../../logger/lamdaCalculus.js";
import {createMonadicIterable} from "../../util/util.js";

export { StackIterator }

/**
 * Creates an {@link IteratorMonadType} on top of the given {@link stack}
 * @param { stack } stack
 * @template _T_
 * @returns IteratorMonadType<_T_>
 * @constructor
 * @example
 * const stack = push(push(push(emptyStack)(1))(2))(3);
 * const stackIterator = StackIterator(stack);
 * console.log(...stackIterator); // 3, 2, 1
 */
const StackIterator = stack => {

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


  return createMonadicIterable(stackIterator);
};

