import { bind }         from "../../operators/bind/bind.js";
import { map }          from "../../operators/map/map.js";
import { pipe }         from "../../operators/pipe/pipe.js";
import { show }         from "../../terminalOperations/show/show.js";
import { eq$ }          from "../../terminalOperations/eq/eq.js";
import { PureSequence } from "../../constructors/pureSequence/pureSequence.js";
import { isIterable }   from "./isIterable.js";

export { SequencePrototype }
/**
 * This function serves as prototype for the {@link SequenceType}.
 *
 */
const SequencePrototype = () => null;


/**
 * @template _T_, _U_
 * @param { (_T_) => SequenceType<_U_> } bindFn
 * @returns { SequenceType<_U_> }
 */
SequencePrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

/**
 * @template _T_, _U_
 * @param { (_T_) => _U_ } mapper - maps the value in the context
 * @returns SequenceType<_U_>
 */
SequencePrototype.fmap = function (mapper) {
  return map(mapper)(this);
};

/**
 * @template _T_
 * @param { _T_ } val - lifts a given value into the context
 * @returns SequenceType<_T_>
 */
SequencePrototype.pure = val => PureSequence(val);

/**
 * @template _T_
 * @returns SequenceType<_T_>
 */
SequencePrototype.empty = () => {
  const emptySequence = () => {
    const iterator = () => {
      const next = () => ({ done: true, value: undefined });
      return { next };
    };

    return {[Symbol.iterator]: iterator};
  };

  const nil = emptySequence();
  Object.setPrototypeOf(nil, SequencePrototype);

  return /** @type SequenceType */ nil;
};

/**
 *
 * @returns { string }
 */
SequencePrototype.toString = function () {
  return show(this);
};

/**
 * @param {...SequenceOperation, PipeTransformer<*,*> } transformers
 * @return { SequenceType<*> | * }
 */
SequencePrototype.pipe = function(...transformers) {
  return pipe(...transformers)(this);
};

/**
 * Tests this {@link SequenceType} for equality against the given {@link Iterable}.
 *
 * @param { Iterable } that
 * @return { Boolean }
 * @example
 * const range = Range(3);
 * const array = [0,1,2,3];
 *
 * console.log(range ["=="] (array));
 * // => Logs 'true'
 */
SequencePrototype["=="] = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};
