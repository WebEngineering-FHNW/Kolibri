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
 *
 * @example
 * const numbers = Range(3);
 * const bindFn  = el => take(el)(repeat(el));
 * const result  = numbers.and(bindFn);
 *
 * console.log(...result);
 * // => Logs '1, 2, 2, 3, 3, 3'
 */
SequencePrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

/**
 * @template _T_, _U_
 * @param { (_T_) => _U_ } mapper - maps the value in the context
 * @returns SequenceType<_U_>
 *
 * @example
 * const numbers = Range(2);
 * const mapped  = numbers.map(el => el * 2);
 *
 * console.log(...numbers);
 * // => Logs '0, 2, 4'
 */
SequencePrototype.fmap = function (mapper) {
  return map(mapper)(this);
};

/**
 * @template _T_
 * @param { _T_ } val - lifts a given value into the context
 * @returns SequenceType<_T_>
 *
 * @example
 * const seq = Range(3).pure(1);
 *
 * console.log(...seq);
 * // => Logs '1'
 */
SequencePrototype.pure = val => PureSequence(val);

/**
 * @template _T_
 * @returns SequenceType<_T_>
 *
 * @example
 * const emptySequence = Range(3).empty();
 *
 * console.log(...emptySequence);
 * // => Logs '' (nothing)
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
 * @param { Number } [maxValues=50] - the amount of elements that should be printed at most
 * @returns { string }
 *
 * @example
 * const numbers = Range(6);
 * const text    = range.toString(3);
 *
 * console.log(text);
 * // => Logs '[0,1,2]'
 */
SequencePrototype.toString = function (maxValues = 50) {
  return show(this, maxValues);
};

/**
 * @param {...SequenceOperation, PipeTransformer<*,*> } transformers
 * @return { SequenceType<*> | * }
 *
 * @example
 * const numbers = Range(5);
 * const piped   = numbers.pipe(
 *                  retainAll(n => n % 2 === 0),
 *                  map(n => 2*n),
 *                  drop(2)
 *                );
 *
 * console.log(...piped);
 * // => Logs '0, 4, 8'
 */
SequencePrototype.pipe = function(...transformers) {
  return pipe(...transformers)(this);
};

/**
 * Tests this {@link SequenceType} for equality against the given {@link Iterable}.
 *
 * @param { Iterable } that
 * @return { Boolean }
 *
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
