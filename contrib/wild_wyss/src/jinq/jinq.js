import {Pair} from "../../../../docs/src/kolibri/stdlib.js";

export {from}

/**
 * @template _T_
 * @typedef JinqType
 * @property { <_U_> (selector:  Functor<_T_, _U_>)  => JinqType<_U_> }               select
 * @property { <_U_> ((prev: _T_) => MonadType<_U_>) => JinqType<_U_> }               fromIn
 * @property { <_U_> (monad:     MonadType<_U_>)     => JinqType<PairType<_T_,_U_>> } join
 * @property {       (predicate: Predicate<_T_>)     => JinqType<_T_> }               where
 * @property {       ()                              => MonadType<_T_> }              result
 */

/**
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 */
const jinq = monad => ({
  join: join(monad),
  where: where(monad),
  select: select(monad),
  fromIn: fromIn(monad),
  result: () => monad
});

const from = jinq;

const fromIn = monad => f => {
  const processed = monad.and(f);
  return jinq(processed);
};
/**
 * @template _T_, _U_
 * @type {
 *          (monad1: MonadType<_T_>)
 *       => (monad2: MonadType<_U_>)
 *       => JinqType<PairType<_T_,_U_>>
 * }
 */
const join = monad1 => monad2 => {
  const processed = monad1.and(x =>
    monad2.and(y =>
      monad1.pure(Pair(x)(y))
    )
  );
  return jinq(processed)
};

/**
 * @type {<_T_>
 *       (monad: MonadType<_T_>)
 *    => (predicate: Predicate<_T_>)
 *    => JinqType<_T_>
 * }
 */
const where = monad => predicate => {
  const processed = monad.and(a => predicate(a) ? monad.pure(a) : monad.empty());
  return jinq(processed);
};

/**
 * @type {<_T_, _U_>
 *       (monad: MonadType<_T_>)
 *    => (selector: Functor<_T_, _U_>)
 *    => JinqType<_U_>
 * }
 */
const select = monad => mapper => {
  const processed = monad.fmap(mapper);
  return jinq(processed);
};