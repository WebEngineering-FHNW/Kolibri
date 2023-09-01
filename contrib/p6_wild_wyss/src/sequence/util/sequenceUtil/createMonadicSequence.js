import { SequencePrototype } from "./sequencePrototype.js";

export { createMonadicSequence }

/**
 *
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns { SequenceType<_T_> }
 */
const setPrototype = iterable => {
  Object.setPrototypeOf(iterable, SequencePrototype);
  return /**@type SequenceType*/ iterable;
};

/**
 * Builds an {@link SequenceType} from a given {@link Iterator}.
 * @template _T_
 * @param { () => Iterator<_T_> } iterator
 * @returns { SequenceType<_T_> }
 */
const createMonadicSequence = iterator => {
  const result = {[Symbol.iterator]: iterator};
  return setPrototype(result);
};
