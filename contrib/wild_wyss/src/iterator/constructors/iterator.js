import { bind }           from "../operators/bind.js";
import { createIterator } from "../util/util.js";

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
 * @param   { _T_ }               value
 * @param   { (_T_) => _T_ }      incrementFunction
 * @param   { (_T_) => Boolean }  isDoneFunction - returns true if the iteration should stop
 * @returns { IteratorType<_T_> }
 * @constructor
 */
const Iterator = (value, incrementFunction, isDoneFunction) => {
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

  /**
   * @template _T_
   * Returns a copy of this Iterator
   * @returns { IteratorType<_T_> }
   */
  const copy = () => Iterator(value, incrementFunction, isDoneFunction);

  return createIterator(next, copy);
};

/**
 * TODO: description
 * @return { null }
 * @template _T_,_U_
 * @property { IteratorAnd<_T_,_U_> } and
 * @constructor
 */
const IteratorPrototype = () => null;

/**
 * @typedef IteratorAnd
 * @template _T_, _U_
 * @param { (_T_) => IteratorType<_U_> } bindFn
 * @returns { IteratorType<_U_> }
 */
IteratorPrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

