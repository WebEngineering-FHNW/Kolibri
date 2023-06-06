import { ArrayIterator } from "../iterator/constructors/arrayIterator/arrayIterator.js";
import { Just, Nothing } from "../stdlib/maybe.js";
import { nil }           from "../iterator/constructors/nil/nil.js";
import { isEmpty }       from "../iterator/terminalOperations/isEmpty/isEmpty.js";
import { PureIterator }  from "../iterator/constructors/pureIterator/pureIterator.js";
import {
  catMaybes,
  JsonIterator,
  mconcat
} from "../iterator/iterator.js"

export { JsonMonad }

/**
 * This {@link JsonMonad} can be used to process JSON data in a fluent way.
 * It wraps a given JSON Array or Object to provide a linq based API called jinq.
 *
 * @see https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/
 * @template _T_
 * @param { String } jsonData
 * @returns JinqType<IteratorType<_T_>
 * @constructor
 * @example
 * const result =
 * from(JsonMonad(jsonData))
 *      .select(x => x["id"])
 *      .result()
 *      .get();
 * console.log(result);
 * // => Logs: all id's from the passed json
 *
 */
const JsonMonad = jsonData => {
  const inner = JsonIterator(jsonData);

  const JsonMonadFactory = maybeObj => {

    const ensureIterable = value => {
      const it = Array.isArray(value) ? value: [value];
      return toMonadicIterable(it)
    };

    const fmap = f => {
      const result = maybeObj.and(iterator => {
        const newIt = iterator.and(elem => {
          const mapped = f(elem); // deep dive into json structure
          return mapped ? ensureIterable(mapped) : nil;
        });

        return isEmpty(newIt) ? Nothing : Just(newIt);
      });

      return JsonMonadFactory(result);
    };

    const and = f => {
      const result = maybeObj.fmap(iterator => {
        const maybeIterators = iterator.fmap(elem => {
          const jsonMonad = f(elem);
          return jsonMonad.get();
        });

        /**@type IteratorType<IteratorType> */
        const catted = /**@type any */catMaybes(maybeIterators);
        return mconcat(catted)
      });

      return JsonMonadFactory(result);
    };

    const pure  = a  => JsonMonadFactory(Just(JsonIterator(a)));
    const empty = () => JsonMonadFactory(Nothing);
    const get   = () => maybeObj;

    return {
      pure,
      empty,
      fmap,
      and,
      get,
    }
  };

  return JsonMonadFactory(Just(inner));
};