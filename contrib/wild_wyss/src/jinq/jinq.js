import { Pair }    from "../../../../docs/src/kolibri/stdlib.js";
import {
  map,
  nil,
  PureIterator
} from "../iterator/iterator.js";

export { from }

/**
 * @template _T_
 * @typedef JinqType
 * @property { SelectCallback<_T_> }  select
 * @property { WhereCallback<_T_> }   where
 * @property { JoinCallback<_T_>}     join
 * @property { () => MonadType<_T_> } result
 */

/**
 * @callback JoinCallback
 * @type {<_T_, _U_>
 *       (monad1: IteratorType<_T_>)
 *    => (monad2: IteratorType<_U_>)
 *    => JinqType<_U_>
 * }
 */

/**
 * @callback WhereCallback
 * @type {<_T_>
 *       (monad: IteratorType<_T_>)
 *    => (predicate: Predicate<_T_>)
 *    => JinqType<_T_>
 * }
 */

/**
 * @callback SelectCallback
 * @type {<_T_, _U_>
 *       (monad: IteratorType<_T_>)
 *    => (selector: Functor<_T_, _U_>)
 *    => JinqType<_U_>
 * }
 */

/**
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType }
 */
const jinq = monad => ({
  join:   join  (monad),
  where:  where (monad),
  select: select(monad),
  result: () => monad
});

const from = jinq;

/**
 * @template _T_, _U_
 * @type JoinCallback<_T_,_U_>
 */
const join = monad1 => monad2 => {
  const processed = monad1.and(x =>
    monad2.and(y =>
      PureIterator(Pair(x)(y))
    )
  );
  return jinq(processed)
};

/**
 * @template _T_
 * @type WhereCallback<_T_>
 */
const where = monad => predicate => {
  const processed = monad.and(a => predicate(a) ? PureIterator(a) : nil);
  return jinq(processed);
};

/**
 * @template _T_, _U_
 * @type SelectCallback<_T_,_U_>
 */
const select = monad => mapper => {
  const processed = map(mapper)(monad);
  return jinq(processed) ;
};