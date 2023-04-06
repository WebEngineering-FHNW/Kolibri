import {
  ArrayIterator,
  ConcatIterator,
  createIteratorWithArgs,
  emptyIterator,
  nextOf,
  reduce$,
} from "./iterator.js";

import { Pair } from "../../../../docs/src/kolibri/stdlib.js";

export {
  map,
  retainAll,
  rejectAll,
  dropWhile,
  drop,
  reverse$,
  cons,
  takeWhile,
  take,
  mconcat,
  cycle,
  zipWith,
  zip,
}

/**
 * Transforms each element using the given function.
 * @function
 * @template _T_
 * @template _U_
 * @pure iterator will be copied defensively
 * @type {
 *            (mapper: Functor<_U_, _T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * const mapped = map(el => el * 2)(it);
 */
const map = mapper => iterator => {
  const inner = iterator.copy();
  let mappedValue;

  const next = () => {
    const { done, value } = nextOf(inner);
    if (!done) mappedValue = mapper(value);
    return { done, value: mappedValue }
  };

  return createIteratorWithArgs(next)(map)(mapper)(inner);
};

/**
 * Only keeps elements which fulfill the predicate.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *             (predicate: Predicate<_T_>)
 *          => IteratorOperation<_T_>
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * // just keep even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const retainAll = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    const applyFilter  = current => {
      const { done, value } = current;
      const result = done || predicate(value);
      return result ? { done, value } : applyFilter(nextOf(inner));
    };

    return applyFilter(nextOf(inner))
  };

  return createIteratorWithArgs(next)(retainAll)(predicate)(inner);
};

/**
 * Only keeps elements which fulfill the predicate.
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it     = Constructors(0, inc, stop);
 * // reject even numbers
 * const filtered = retainAll(el => el % 2 === 0)(it);
 */
const rejectAll = predicate => iterator =>
  // flip the predicate and call retainAll
  retainAll(el => !predicate(el))(iterator);

/**
 * Proceeds with the iteration where the predicate no longer holds.
 *
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (predicate: Predicate<_T_>)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
 * // discard all elements until one element is bigger or equal to 2.
 * const dropped = dropWhile(el => el < 2)(it);
 */
const dropWhile = predicate => iterator => {
  const inner = iterator.copy();

  const next = () => {
    let { done, value } = nextOf(inner);

    while(!done && predicate(value)) {
      const n = nextOf(inner);
      done    = n.done;
      value   = n.value;
    }

    return { done, value }
  };

  return createIteratorWithArgs(next)(dropWhile)(predicate)(inner);
};

/**
 * Jumps over so many elements.
 *
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (count: number)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
 * const dropped = drop(2)(it);
 */
const drop = count => iterator => {

  /**
   * @type { <_T_>
   *     (start: Number)
   *  => (count: Number)
   *  => (iterator: IteratorType<_T_>)
   *  => IteratorType<_T_>
   * }
   */
  const dropFactory = start => count => iterator => {
    const inner = iterator.copy();

    const next = () => {
      let { done, value } = nextOf(inner);

      while (!done && start++ < count) {
        const n = nextOf(inner);
        done = n.done;
        value = n.value;
      }

      return { done, value }
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => dropFactory(start)(count)(inner),
    }
  };
  return dropFactory(0)(count)(iterator);
};

/**
 * Processes the iterator backwards.
 * @template _T_
 * @function
 * @pure iterator will be copied defensively
 * @type {
 *             (iterator: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @example
 * const it       = Constructors(0, inc, stop);
 * const reversed = reverse$(it);
 */
const reverse$ = iterator => {
  const values = [...iterator.copy()].reverse();

  return ArrayIterator(values);
};

/**
 * Adds the given element to the front of the iterator.
 * _Note_:
 * Since cons creates a copy of the {@link IteratorType}, it's better to use {@link IteratorBuilderType},
 * if you want to add many elements (more than 100).
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (element: _T_)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it       = Constructors(0, inc, stop);
 * const element  = 1;
 * const iterator = cons(element)(it);
 */
const cons = element => iterator => {
  const inner = iterator.copy();
  let value = element;

  const next = () => {
    if (value !== undefined) {
      value = undefined;
      return { done: false, value: element };
    }
    return nextOf(inner);
  };
  return {
    [Symbol.iterator]: () => ({ next }),
    copy: () => cons(value)(inner)
  }
};

/**
 * Proceeds with the iteration until the predicate becomes true
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (predicate: (_T_) => Boolean)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
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

  return createIteratorWithArgs(next)(takeWhile)(predicate)(inner);
};

/**
 * Stop after so many elements
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @type {
 *            (count: Number)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Constructors(0, inc, stop);
 * // only keep the next 4 elements, ignore the others
 * const dropped = take(4)(it);
 */
const take = count => iterator => {

  /**
   * @type { <_T_>
   *     (start: Number)
   *  => (count: Number)
   *  => (iterator: IteratorType<_T_>)
   *  => IteratorType<_T_>
   * }
   */
  const takeFactory = start => count => iterator => {
    const inner = iterator.copy();

    const next = () => {
      const el = nextOf(inner);
      // the iterator finishes, when the predicate does not return true anymore,
      // or the previous iterator has no more elements left
      const done = el.done || start++ >= count;
      return { value: el.value, done };
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => takeFactory(start)(count)(inner)
    };
  };
  return takeFactory(0)(count)(iterator);
};

/**
 * @function
 * @template _T_
 * @pure both iterators will be copied defensively
 * @param { IteratorType<IteratorType<_T_>> } iterator -
 * @returns IteratorType<_T_>
 * @example
 * const iterators = ArrayIterator([
 *   Range(2),
 *   Range(2),
 *   Range(2),
 * ]);
 * const result = mconcat(iterators);
 * console.log(...result);
 * // prints: 0, 1, 2, 0, 1, 2, 0, 1, 2
 */
const mconcat = iterator =>
  /**
   * @template _T_
   * @type { IteratorType<_T_> }
   */
  reduce$((acc, cur) => ConcatIterator(acc)(cur), emptyIterator)(iterator);

/**
 * {@link cycle Cycle} ties a finite {@link IteratorType} into a circular one, or equivalently, the infinite repetition of the original {@link IteratorType}.
 * @function
 * @template _T_
 * @pure iterator will be copied defensively
 * @param { IteratorType<_T_> } iterator
 * @returns IteratorType<_T_>
 * @example
 * const it     = Range(2);
 * const cycled = cycle(it);
 * console.log(take(6)(cycled));
 * // prints: 0, 1, 2, 0, 1, 2
 */
const cycle = iterator => {

  // cycleFactory is used to create a proper copy and makes sure the following points:
  // - continue from the current value of the underlying iterator (and not from the first value of the origin iterator)
  // - that the iterator works on the full range of the original iterator when the next cycle begins
  const cycleFactory = original => current => {

    const origin  = original.copy();
    let inner     = current.copy();

    const next = () => {
      const result = nextOf(inner);
      if (!result.done) return result;

      inner = origin.copy();
      return nextOf(inner);
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => cycleFactory(origin)(inner),
    }
  };

  return cycleFactory(iterator)(iterator);
};

/**
 * {@link zipWith ZipWith} generalises {@link zip} by zipping with the function given as the first argument, instead of a {@link pair} constructor.
 * @function
 * @pure both iterators will be copied defensively
 * @template _T_
 * @template _U_
 * @template _V_
 * @type {
 *             (zipper: BiFunction<_T_, _U_, _V_>)
 *          => (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_U_>)
 *          => IteratorType<_V_>
 * }
 * @example
 * const it1 = Range(2);
 * const it2 = Range(2, 4);
 * const zipped = zipWith((i,j) => [i,j])(it1)(it2);
 * console.log(...zipped)1;
 * // prints: [0,2], [1,3], [2,4]
 */
const zipWith = zipper => it1 => it2 => {
  const inner1 = it1.copy();
  const inner2 = it2.copy();
  /**
   * @template _V_
   * @type _V_
   * */
  let zippedValue;

  const next = () => {
    const { done: done1, value: value1 } = nextOf(inner1);
    const { done: done2, value: value2 } = nextOf(inner2);
    const done = done1 || done2;

    if (!done) zippedValue = zipper(value1, value2);

    return {
      done:  done,
      /**
       * @template _V_
       * @type _V_  */
      value: zippedValue
    };
  };

  const copy = () => zipWith(zipper)(inner1)(inner2);
  return {
    [Symbol.iterator]: () => ({ next }),
    copy,
  };
};

/**
 * Zip takes two {@link IteratorType Iterators} and returns a {@link IteratorType iterator} of corresponding pairs.
 * @function
 * @pure both iterators will be copied defensively
 * @template _T_
 * @template _U_
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_U_>)
 *          => IteratorType<PairType<_T_, _U_>>
 * }
 * @example
 * const it1 = Range(2);
 * const it2 = Range(2, 4);
 * const zipped = zip(it1)(it2);
 * console.log([...zipped].map(snd));
 * // prints: 2, 3, 4
 */
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);
