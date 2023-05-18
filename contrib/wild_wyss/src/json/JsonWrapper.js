export { JsonWrapper }
import {Just, Nothing} from "../stdlib/maybe.js";

/**
 *
 * @param obj
 * @return {}
 * @constructor
 */
const JsonWrapper = obj => {

  /**
   *
   * @param {}maybeObj
   * @return {any}
   * @constructor
   */
  const JsonWrapperFactory = maybeObj => {

    const pure = a => JsonWrapperFactory(Just(a));

    const empty = () => JsonWrapperFactory(Nothing);

    const fmap = f => {
      const result = maybeObj.and(x => {
        const result = f(x);
        return result ? Just(result): Nothing;
      });
      return JsonWrapperFactory(result);
    };

    // x => x.adress
    // f :: _T_ -> JsonWrapper<_U_>
    const and = f => {

      const result = maybeObj.and(x => {
        const result = f(x);
        return result.get();
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

  return JsonWrapperFactory(Just(obj));
};
