import { Pair } from "../stdlib/pair.js";

export { from }

/**
 * JINQ brings query capabilities to any monadic type.
 * With it, it is possible to query different data sources using the one and same query language.
 *
 * @template _T_
 * @typedef JinqType
 * @property { <_U_> (selector:  Functor<_T_, _U_>)  => JinqType<_U_> }               map      - maps the current value to a new value
 * @property { <_U_> (selector:  Functor<_T_, _U_>)  => JinqType<_U_> }               select   - alias for map
 * @property { <_U_> ((prev: _T_) => MonadType<_U_>) => JinqType<_U_> }               inside   - maps the current value to a new {@link MonadType}
 * @property { <_U_> (monad:     MonadType<_U_>)     => JinqType<PairType<_T_,_U_>> } pairWith - combines the underlying data structure with the given data structure as {@link PairType}
 * @property {       (predicate: Predicate<_T_>)     => JinqType<_T_> }               where    - only keeps the items that fulfill the predicate
 * @property {       ()                              => MonadType<_T_> }              result   - returns the result of this query
 */

/**
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 */
const jinq = monad => ({
  pairWith: pairWith(monad),
  where:    where   (monad),
  select:   select  (monad),
  map:      select  (monad),
  inside:   inside  (monad),
  result:   () =>    monad
});

/**
 * Serves as starting point to enter JINQ and specifies a data source.
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 */
const from = jinq;

const inside = monad => f => {
  const processed = monad.and(f);
  return jinq(processed);
};

/**
 * @template _T_, _U_
 * @type {
 *           (monad1: MonadType<_T_>)
 *        => (monad2: MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 */
const pairWith = monad1 => monad2 => {
  const processed = monad1.and(x =>
    monad2.fmap(y => Pair(x)(y))
  );

  return jinq(processed)
};

/**
 * @type { <_T_>
 *            (monad: MonadType<_T_>)
 *         => (predicate: Predicate<_T_>)
 *         => JinqType<_T_>
 *       }
 */
const where = monad => predicate => {
  const processed = monad.and(a => predicate(a) ? monad.pure(a) : monad.empty());
  return jinq(processed);
};

/**
 * @type { <_T_, _U_>
 *           (monad: MonadType<_T_>)
 *        => (selector: Functor<_T_, _U_>)
 *        => JinqType<_U_>
 *       }
 */
const select = monad => mapper => {
  const processed = monad.fmap(mapper);
  return jinq(processed);
};