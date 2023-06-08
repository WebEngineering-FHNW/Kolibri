import { Just, Nothing } from "../stdlib/maybe.js";
import { nil }           from "../iterator/constructors/nil/nil.js";
import { isEmpty }       from "../iterator/terminalOperations/isEmpty/isEmpty.js";
import { PureIterator }  from "../iterator/constructors/pureIterator/pureIterator.js";
import {
  catMaybes,
  mconcat
} from "../iterator/iterator.js"
import {createIterator, createMonadicIterable, iteratorOf} from "../iterator/util/util.js";

export { JsonMonad }

/**
 * This {@link JsonMonad} can be used to process JSON data or JS objects in a fluent way.
 * It is mainly used with {@link JinqType}.
 * @see https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/
 * @template _T_
 * @param { Object | Array<_T_> } jsObject
 * @returns MonadType<_T_>
 * @constructor
 * @example
 * const result =
 *    from(JsonMonad(jsObject))
 *      .select(x => x["id"])
 *      .result()
 *      .get();
 * console.log(result);
 * // => Logs all ids of the passed json
 *
 */
const JsonMonad = jsObject => {
  if (!jsObject[Symbol.iterator]) {
    jsObject = [jsObject];
  }
  const inner = innerIterable(...jsObject);

  /**
   *
   * @template _T_
   * @param { MaybeType<IteratorMonadType<_T_>> & MaybeMonadType<_T_> } maybeObj
   * @returns { MonadType<_T_> }
   * @constructor
   */
  const JsonMonadFactory = maybeObj => {

    const ensureIterable = value => {
      const it = Array.isArray(value) ? value: [value];
      return innerIterable(...it)
    };

    const fmap = f => {
      // the result can be turned to nothing as well, therefore and on maybe must be used
      const result = maybeObj.and(iterator => {
        const newIt = iterator.and(elem => {
          const mapped = f(elem); // deep dive into json structure
          return mapped ? ensureIterable(mapped) : nil;
        });

        return isEmpty(newIt) ? Nothing : Just(newIt);
      });

      // wrap result in json monad again
      return JsonMonadFactory(result);
    };

    const and = f => {
      // Map each element of this iterator, that might be in this maybe
      const result = maybeObj.fmap(iterator => {
        const maybeIterators = iterator.fmap(elem => {
          // f :: _T_ -> JsonMonad<IteratorMonadType<MaybeXType<_T_>>>
          const jsonMonad = f(elem);
          return jsonMonad.get(); // unwrap the JsonMonad to access the iterator in it.
        });

        /**@type IteratorMonadType<IteratorMonadType> */
        const catted = /**@type any */catMaybes(maybeIterators);
        return mconcat(catted)
      });

      return JsonMonadFactory(result);
    };

    const pure  = a  => JsonMonad(PureIterator(a));
    const empty = () => JsonMonadFactory(Nothing);

    const iterator = () => {
      let inner;
     maybeObj
      (() => inner = nil)
      (it => inner = it);

      return iteratorOf(inner);
    };

    return {
      pure,
      empty,
      fmap,
      and,
      [Symbol.iterator]: iterator,
      get: () => maybeObj
    }
  };

  return JsonMonadFactory(Just(inner));
};


/**
 * Helper function to create an {@link IteratorMonadType} from varargs.
 *
 * {@link toMonadicIterable } can't be used here, because sub iterables shouldn't be consumed
 * @template _T_
 * @param  { ..._T_ } elements - the elements to iterate on
 * @returns {IteratorMonadType<*>}
 */
const innerIterable = (...elements) => {
  const iterator = () => {
    const inner = iteratorOf(elements);

    const next = () => inner.next();
    return { next };
  };
  return createMonadicIterable(iterator);
};