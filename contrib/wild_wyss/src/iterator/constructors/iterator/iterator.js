import {createIterator, createMonadicIterable, isIterable} from "../../util/util.js";
import { bind }           from "../../operators/bind/bind.js";
import { map }            from "../../operators/map/map.js"
import { PureIterator }   from "../pureIterator/pureIterator.js";
import { show }           from "../../terminalOperations/show/show.js";
import {eq$} from "../../terminalOperations/eq/eq.js";

export { Iterator, IteratorPrototype }

/**
 *
 * The incrementFunction should change the value (make progress) in a way
 * that the isDoneFunction function can recognize the end of the iterator.
 *
 * Contract:
 * - incrementFunction & isDoneFunction should not refer to any mutable
 *   state variable (because of side effect) in the closure.
 *   Otherwise, copying and iterator may not work as expected.
 * - Functions ending with a "$" must not be applied to infinite iterators.
 *
 * @template _T_
 * @param   { _T_ }               start
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  isDoneFunction - returns true if the iteration should stop
 * @returns { IteratorMonadType<_T_> }
 * @constructor
 */
const Iterator = (start, incrementFunction, isDoneFunction) => {

  const iteratorIterator = () => {
    let value = start;
    /**
     * @template _T_
     * Returns the next iteration of this iterable object.
     * @returns { IteratorResult<_T_, _T_> }
     */
    const next = () => {
      const current = value;
      const done = isDoneFunction(current);
      if (!done) value = incrementFunction(value);
      return { done, value: current };
    };

    return { next };
  };

  /**
   * @template _T_
   * Returns a copy of this Iterator
   * @returns { IteratorMonadType<_T_> }
   */

  return createMonadicIterable(iteratorIterator);
};

/**
 * This function serves as prototype for the {@link IteratorMonadType}.
 *
 */
const IteratorPrototype = () => null;


/**
 * @template _T_, _U_
 * @param { (_T_) => IteratorMonadType<_U_> } bindFn
 * @returns { IteratorMonadType<_U_> }
 */
IteratorPrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

/**
 * @template _T_, _U_
 * @param { (_T_) => _U_ } mapper - maps the value in the context
 * @returns IteratorMonadType<_U_>
 */
IteratorPrototype.fmap = function (mapper) {
  return map(mapper)(this);
};

/**
 * @template _T_
 * @param { _T_ } val - lifts a given value into the context
 * @returns IteratorMonadType<_T_>
 */
IteratorPrototype.pure = val => PureIterator(val);

/**
 * @template _T_
 * @returns IteratorMonadType<_T_>
 */
IteratorPrototype.empty = () => Iterator(undefined, _ => undefined, _ => true);

/**
 *
 * @returns { string }
 */
IteratorPrototype.toString = function () {
  return show(this);
};

/**
 * Tests this {@link IteratorMonadType} for equality against the given {@link Iterable}.
 *
 * @param { Iterable } that
 * @return { Boolean }
 * @example
 * const it1 = Range(3);
 * const it2 = [0,1,2,3];
 *
 * console.log(it1 ["=="] it2);
 * // => Logs 'true'
 *
 */
IteratorPrototype["=="] = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};