import { ArrayIterator, createIterator, nextOf }  from "./iterator.js";
import { arrayEq }                                from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Pair }                                   from "../../../../docs/src/kolibri/stdlib.js";

export {
  map,
  retainAll,
  rejectAll,
  eq$,
  head,
  isEmpty,
  dropWhile,
  drop,
  reverse$,
  concat$,
  cons$,
  takeWhile,
  take,
  reduce$,
  forEach$,
  uncons
}

/**
 * Transforms each element using the given function.
 * @function
 * @template _T_
 * @template _U_
 * @pure
 * @type {
 *               (mapper: Functor<_U_, _T_>)
 *            => (iterator: IteratorType<_U_>)
 *            => IteratorType<_T_>
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
 * // just keep even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const retainAll = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = predicate(value) || done;
      return result ? { done, value } : applyFilter(nextOf(inner));
    };
    return applyFilter(nextOf(inner))
  };

  return createIterator(next)(retainAll)(predicate)(inner);
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
 * // reject even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const rejectAll = predicate => iterator =>
  // flip the predicate and call retainAll
  retainAll(el => !predicate(el))(iterator);

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
 * Return the next value without consuming it.
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
 * // discard all elements until one element is bigger or equal to 2.
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

/**
 * Proceeds with the iteration until the predicate becomes true
 * @function
 * @template _T_
 * @type {
 *    (predicate: (_T_) => Boolean) =>
 *    (iterator: IteratorType<_T_>) =>
 *    IteratorType<_T_>
 * }
 * @example
 * const it      = Iterator(0, inc, stop);
 * // keep all elements until one element is bigger or equal to 2.
 * const dropped = takeWhile(el => el < 2)(it);
 */
const takeWhile = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const el = nextOf(inner);
    // the iterator finishes, when the predicate does not return true anymore,
    // or the previous iterator has no more elements left
    const done = el.done || !predicate(el.value);
    return  { value: el.value, done };
  };
  return createIterator(next)(takeWhile)(predicate)(inner);
};

/**
 * Stop after so many elements
 * @function
 * @template _T_
 * @type {
 *    (count: Number) =>
 *    (iterator: IteratorType<_T_>) =>
 *    IteratorType<_T_>
 * }
 * const it      = Iterator(0, inc, stop);
 * // only keep the next 4 elements, ignore the others
 * const dropped = take(4)(it);
 */
const take = count => iterator => {
  let i = 0;
  // just returning takeWhile would break copy, since the state of i would be the same for all copies
  const inner = takeWhile(_ => i++ < count)(iterator);
  return createIterator(inner[Symbol.iterator]().next)(take)(count)(iterator);
};

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @function
 * @template _T_
 * @type {
 *          (accumulationFn: BinaryOperation<_T_>, start: _T_) =>
 *          (iterator: IteratorType<_T_>) =>
 *          _T_
 *       }
 * @returns {function(*): *}
 */
const reduce$ = (accumulationFn, start) => iterator => {
  const inner = iterator.copy();
  let accumulator = start;
  for (const current of inner) {
     accumulator = accumulationFn(accumulator, current);
  }
  return accumulator;
};

/* TODO: ist das die richtige Art die Operation zu implemeniteren?
    sollte hier besser auf currying verzichtet werdne? macht es
    Sinn hier wieder einen Iterator zurück zugeben damit man die Funktion pipen kann?
*/
/**
 * Executes the callback for each element.
 * @function
 * @template _T_
 * @type {
 *   (callback: Consumer<_T_>) =>
 *   (iterator: IteratorType<_T_>) =>
 *   IteratorType<_T_>
 * }
 */
const forEach$ = callback => iterator => {
  const inner = iterator.copy();
  // copy again to return it later,
  // Since the user of forEach$ could consume the initial iterator during the callback() function
  for (const current of inner.copy()) {
    callback(current);
  }
  return inner;
};

/* TODO: macht es Sinn hier ein Pair zurück zugeben?
    Haskell macht das analog:https://hackage.haskell.org/package/base-4.17.0.0/docs/Data-List.html#v:uncons
*/
/**
 * @function
 * @template _T_
 * @param { IteratorType<_T_> } iterator
 * @returns {(s: pairSelector) => (_T_ |IteratorType<_T_>)}
 */
const uncons = iterator => {
  const inner = iterator.copy();
  const { value } = nextOf(inner);
  return Pair(value)(inner);
};