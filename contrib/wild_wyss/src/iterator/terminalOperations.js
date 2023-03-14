import { arrayEq } from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { nextOf }  from "./iterator.js";
import { Pair }    from "../../../../docs/src/kolibri/stdlib.js";

export {
  reduce$,
  forEach$,
  uncons,
  eq$,
  head,
  isEmpty,
}

/**
 * Checks the equality of two non-infinite iterators.
 *
 * _Note_: Two iterators are considered as equal if they contain or create the exactly same values in the same order.
 * @function
 * @pure it1 and it2 will be copied defensively
 * @type {
 *             (it1: IteratorType<*>)
 *          => (it2: IteratorType<*>)
 *          => Boolean
 *       }
 * @example
 * const it1    = Iterator(0, inc, stop);
 * const it2    = Iterator(0, inc, stop);
 * const result = eq$(it1)(it2);
 */
const eq$ = it1 => it2 =>
  arrayEq([...it1.copy()])([...it2.copy()]);

// TODO: this implementation does not seem to be correct. an iterator could contain elements after an undefined head. Maybe it would be better to check for the done property
/**
 * Returns true, if the iterators head is undefined.
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (iterator: IteratorType<_T_>)
 *         => Boolean
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = isEmpty(it);
 */
const isEmpty = iterator => head(iterator) === undefined;

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @function
 * @template _T_
 * @type {
 *             (accumulationFn: BiOperation<_T_>, start: _T_)
 *          => (iterator: IteratorType<_T_>)
 *          => _T_
 *       }
 */
const reduce$ = (accumulationFn, start) => iterator => {
  const inner = iterator.copy();
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};

/**
 * Executes the callback for each element.
 * @function
 * @template _T_
 * @type {
 *            (callback: Consumer<_T_>)
 *         => (it: IteratorType<_T_>)
 *         => void
 *       }
 */
const forEach$ = callback => iterator => {
  for (const current of iterator.copy()) {
    callback(current);
  }
};

/**
 * Removes the first element of this iterator.
 * @function
 * @template _T_
 * @param   { IteratorType<_T_> } iterator
 * @returns { (s: pairSelector) => (_T_ |IteratorType<_T_>) }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = uncons(it);
 * const head   = result(fst); // 0
 * const tail   = result(snd); // 1, 2, 3, ...
 */
const uncons = iterator => {
  const inner = iterator.copy();
  const { value } = nextOf(inner);

  return Pair(value)(inner);
};

/**
 * Return the next value without consuming it.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *              (iterator: IteratorType<_T_>)
 *          =>  _T_
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = head(it);
 */
const head = iterator => {
  const inner = iterator.copy();
  const { done, value } = nextOf(inner);

  return done ? undefined : value;
};
