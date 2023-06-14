import { createMonadicSequence, isIterable } from "../../util/util.js";
import { bind }                              from "../../operators/bind/bind.js";
import { map }                               from "../../operators/map/map.js"
import { PureSequence }                      from "../pureSequence/pureSequence.js";
import { show }                              from "../../terminalOperations/show/show.js";
import { eq$ }                               from "../../terminalOperations/eq/eq.js";

export { Sequence, SequencePrototype }

/**
 * The `incrementFunction` should change the value (make progress) in a way
 * that the `untilFunction` function can recognize the end of the sequence.
 *
 * Contract:
 * - `incrementFunction` & `untilFunction` should not refer to any mutable
 *   state variable (because of side effect) in the closure.
 * - Functions ending with a "$" must not be applied to infinite {@link Iterable Iterables}.
 *
 * @constructor
 * @template _T_
 * @param   { _T_ }               start
 * @param   { (_T_) => Boolean }  untilFunction - returns true if the iteration should stop
 * @param   { (_T_) => _T_ }      incrementFunction
 * @returns { SequenceType<_T_> }
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
      const done = untilFunction(current);
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
SequencePrototype.empty = () => Sequence(undefined, _ => true, _ => undefined);

/**
 *
 * @returns { string }
 */
SequencePrototype.toString = function () {
  return show(this);
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