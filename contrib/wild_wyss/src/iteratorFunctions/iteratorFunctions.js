import { ArrayIterator, createIterator, nextOf } from "./iterator.js";
import { arrayEq }                               from "../../../../docs/src/kolibri/util/arrayFunctions.js";

export {
  map,
  filter,
  eq$,
  head,
  isEmpty,
  dropWhile,
  drop,
  reverse$,
  concat$,
  cons$,
}

/**
 * Transform each element.
 * @template _T_
 * @function
 * @pure
 * @type {
 *               (mapper: Functor)
 *            => (iterator: IteratorType)
 *            => IteratorType
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const mapped = map(el => el * 2)(it);
 */
const map = mapper => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const { done, value } = nextOf(inner);
    return {
      done,
      value: mapper(value)
    }
  };

  return createIterator(next)(map)(mapper)(inner);
};

/**
 * @template _T_
 * @function
 * @pure
 * @type {
 *             (predicate: Predicate)
 *          => (iterator: IteratorType)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const mapped = filter(el => el !== 2)(it);
 */
const filter = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = predicate(value) || done;
      return result ? { done, value } : applyFilter(nextOf(inner));
    };
    return applyFilter(nextOf(inner))
  };

  return createIterator(next)(filter)(predicate)(inner);
};

/**
 * Checks the equality of two non-infinite iterators.
 * @function
 * @pure
 * @type {
 *             (it1: IteratorType)
 *          => (it2: IteratorType)
 *          => boolean
 *       }
 * @example
 * const it1    = Iterator(0, inc, stop);
 * const it2    = Iterator(0, inc, stop);
 * const result = eq$(it1)(it2);
 */
const eq$ = it1 => it2 =>
  arrayEq([...it1.copy()])([...it2.copy()]);

/**
 * Return the next value without consuming it.
 * @function
 * @pure
 * @type { (it1: IteratorType) => any }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = head(it);
 */
const head = iterator => {
  const inner = iterator.copy();
  const { done, value } = nextOf(inner);
  return done ? undefined : value;
};

/**
 * Returns true, if the iterators head is undefined.
 * @function
 * @pure
 * @param   { IteratorType } iterator
 * @returns { boolean }
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = isEmpty(it);
 */
const isEmpty = iterator => head(iterator) === undefined;

/**
 * Proceed with the iteration where the predicate no longer holds.
* @template _T_
* @function
* @pure
* @type {
*             (predicate: Predicate)
  *          => (iterator: IteratorType)
  *          => IteratorType<_T_>
  *      }
* @example
* const it      = Iterator(0, inc, stop);
* const dropped = dropWhile(el => el < 2)(it);
*/
const dropWhile = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    let { done, value } = nextOf(inner);

    while(predicate(value) && !done) {
      const n = nextOf(inner);
      done    = n.done;
      value   = n.value;
    }
    return {
      done,
      value
    }
  };
  return createIterator(next)(dropWhile)(predicate)(inner);
};

/**
 * Jump over so many elements.
 * @template _T_
 * @function
 * @pure
 * @type {
 *             (count: number)
 *          => (iterator: IteratorType)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it      = Iterator(0, inc, stop);
 * const dropped = drop(2)(it);
 */
const drop = count => iterator => {
  let i = 0;

  const inner = iterator.copy();

  const next = () => {
    let { done, value } = nextOf(inner);

    while( i++ < count && !done) {
      const n = nextOf(inner);
      done    = n.done;
      value   = n.value;
    }
    return {
      done,
      value
    }
  };
  return createIterator(next)(drop)(count)(inner);

};

/**
 * Process the iterator backwards.
 * @template _T_
 * @function
 * @pure
 * @type { (iterator: IteratorType) => IteratorType<_T_> }
 * @example
 * const it       = Iterator(0, inc, stop);
 * const reversed = reverse(it);
 */
const reverse$ = iterator => {
  const values = [...iterator.copy()].reverse();
  return ArrayIterator(values);
};

/**
 * Add an iterator to the existing iterators end.
 * @template _T_
 * @function
 * @pure
 * @type {
 *             (it1: IteratorType)
 *          => (it2: IteratorType)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it1     = Iterator(0, inc, stop);
 * const it2     = Iterator(0, inc, stop);
 * const concat = concat$(it1)(it2);
 */
const concat$ = it1 => it2 => ArrayIterator([...it1, ...it2]);

/**
 * Add the element {@link a} to the front of the iterator.
 * @template _T_
 * @function
 * @pure
 * @type {
 *             (element: any)
 *          => (it: IteratorType)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it      = Iterator(0, inc, stop);
 * const element = 1;
 * const cons    = cons$(element)(it2);
 */
const cons$ = a => iterator => {
  const inner = iterator.copy();
  return ArrayIterator([a, ...inner]);
};