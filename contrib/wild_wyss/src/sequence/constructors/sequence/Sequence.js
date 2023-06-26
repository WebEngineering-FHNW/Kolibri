import { createMonadicSequence, isIterable }        from "../../util/util.js";
import { bind, map, PureSequence, show, eq$, pipe } from "../../sequence.js"

export { Sequence, SequencePrototype }

/**
 * The `incrementFunction` should change the value (make progress) in a way that the `untilFunction` function can
 * recognize the end of the sequence.
 *
 * Contract:
 * - `incrementFunction` & `untilFunction` should not refer to any mutable state variable (because of side effect) in
 *   the closure.
 *
 * @constructor
 * @pure if `untilFunction` & `incrementFunction` are pure
 * @template _T_
 * @param   { _T_ }               start             - the first value to be returned by this sequence
 * @param   { (_T_) => Boolean }  untilFunction     - returns false if the iteration should stop
 * @param   { (_T_) => _T_ }      incrementFunction - calculates the next value based on the previous
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const start      = 0;
 * const untilF     = x => x < 3;
 * const incrementF = x => x + 1;
 * const sequence   = Sequence(start, untilF, incrementF);
 *
 * console.log(...sequence);
 * // => Logs '0, 1, 2'
 */

const Sequence = (start, untilFunction, incrementFunction) => {

  const iterator = () => {
    let value = start;
    /**
     * @template _T_
     * Returns the next iteration of this iterable object.
     * @returns { IteratorResult<_T_, _T_> }
     */
    const next = () => {
      const current = value;
      const done = !untilFunction(current);
      if (!done) value = incrementFunction(value);
      return { done, value: current };
    };

    return { next };
  };

  return createMonadicSequence(iterator);
};

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
SequencePrototype.empty = () => Sequence(undefined, _ => false, _ => undefined);

/**
 *
 * @returns { string }
 */
SequencePrototype.toString = function () {
  return show(this);
};

/**
 * @param {...SequenceOperation<*,*> } transformers
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