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
 * Transforms each element using the given function.
 * @function
 * @template _T_
 * @template _U_
 * @pure
 * @type {
 *               (mapper: Functor<_T_, _U_>)
 *            => (iterator: IteratorType<_T_>)
 *            => IteratorType<_U_>
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
 * Only keeps elements which fulfill the predicate.
 * @function
 * @template _T_
 * @pure
 * @type {
 *             (predicate: Predicate<_T_>)
 *          => (iterator: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it     = Iterator(0, inc, stop);
 * // reject all odd numbers
 * const filtered = filter(el => el % 2 === 0)(it);
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
 *
 *_Note_: Two iterators are considered as equal if they contain or create the exactly same values in the same order.
 * @function
 * @pure
 * @type {
 *             (it1: IteratorType<*>)
 *          => (it2: IteratorType<*>)
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
 * Returns the next value of this iterator.
 *
 * _Note_: The value will not be consumed.
 * @function
 * @template _T_
 * @pure
 * @param   { IteratorType<_T_> } iterator
 * @returns _T_
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = head(it);
 */
const head = iterator => {
  const inner = iterator.copy();
  const { done, value } = nextOf(inner);
  return done ? undefined : value;
};


// TODO: this implementation does not seem to be correct. an iterator could contain elements after an undefined head. Maybe it would be better to check for the done property
/**
 * Returns true, if the iterators head is undefined.
 *
 * @function
 * @template _T_
 * @pure
 * @param   { IteratorType<_T_> } iterator
 * @returns boolean
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = isEmpty(it);
 */
const isEmpty = iterator => head(iterator) === undefined;

/**
 * Proceeds with the iteration where the predicate no longer holds.
 *
 * @function
 * @template _T_
 * @pure
 * @type {
 *              (predicate: Predicate<_T_>)
 *           => (iterator: IteratorType<_T_>)
 *           => IteratorType<_T_>
 *       }
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
 * Jumps over so many elements.
 *
 * @function
 * @template _T_
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
  return dropWhile(_ => i++ < count)(iterator);
};

/**
 * Processes the iterator backwards.
 * @template _T_
 * @function
 * @pure
 * @param { IteratorType<_T_> } iterator
 * @returns IteratorType<_T_>
 * @example
 * const it       = Iterator(0, inc, stop);
 * const reversed = reverse(it);
 */
const reverse$ = iterator => {
  const values = [...iterator.copy()].reverse();
  return ArrayIterator(values);
};

// TODO: the iterators should be copied here
/**
 * Adds the second iterator to the first iterators end.
 * @function
 * @template _T_
 * @pure
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it1     = Iterator(0, inc, stop);
 * const it2     = Iterator(0, inc, stop);
 * const concat = concat$(it1)(it2);
 */
const concat$ = it1 => it2 => ArrayIterator([...it1, ...it2]);

/**
 * Adds the given element to the front of the iterator.
 * @function
 * @template _T_
 * @pure
 * @type {
 *             (element: _T_)
 *          => (it: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it      = Iterator(0, inc, stop);
 * const element = 1;
 * const cons    = cons$(element)(it2);
 */
const cons$ = element => iterator => {
  const inner = iterator.copy();
  return ArrayIterator([element, ...inner]);
};