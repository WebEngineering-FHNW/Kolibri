import {catMaybes, JsonIterator, mconcat} from "../iterator/iterator.js"
import {ArrayIterator} from "../iterator/constructors/arrayIterator/arrayIterator.js";

import {Just, Nothing} from "../stdlib/maybe.js";
import {nil} from "../iterator/constructors/nil/nil.js";
import {isEmpty} from "../iterator/terminalOperations/isEmpty/isEmpty.js";
import {PureIterator} from "../iterator/constructors/pureIterator/pureIterator.js";

export { JsonWrapper }

/**
 *
 * @param obj
 * @constructor
 */
const JsonWrapper = obj => {
  const inner = JsonIterator(obj);

  /**
   *
   * @return {any}
   * @constructor
   */
  const JsonWrapperFactory = maybeObj => {

    const pure = a => JsonWrapperFactory(Just(JsonIterator(a)));

    const empty = () => JsonWrapperFactory(Nothing);

    const fmap = f => {
      const result = maybeObj.and(iterator => {
        const newIt = iterator.and(elem => {
          const mapped = f(elem);

          if (Array.isArray(mapped)) {
            return ArrayIterator(mapped);
          }
          return mapped ? PureIterator(mapped): nil;
        });

        return isEmpty(newIt) ? Nothing : Just(newIt);
      });

      return JsonWrapperFactory(result);
    };

    const and = f => {
      const result = maybeObj.fmap(iterator => {
        const maybeIterators = iterator.fmap(elem => {
          const jsonWrapper = f(elem);
          return jsonWrapper.get();
        });

        /**@type IteratorType<IteratorType> */
        const catted = /**@type any */catMaybes(maybeIterators);
        return mconcat(catted)
      });

      return JsonWrapperFactory(result);
    };

    const get = () => maybeObj;

    return {
      pure,
      empty,
      fmap,
      and,
      get,
    }
  };

  return JsonWrapperFactory(Just(inner));
};
