// noinspection GrazieInspection

import { Pair } from "../lambda/pair.js";

export { from }

/**
 * JINQ brings query capabilities to any monadic type.
 * With it, it is possible to query different data sources using the one and same query language.
 *
 * @template _T_
 * @template _U_
 * @typedef JinqType
 * @property { <_U_> (selector:  FunctionType<_T_, _U_>)      => JinqType<_U_> }               map      - maps the current value to a new value
 * @property { <_U_> (selector:  FunctionType<_T_, _U_>)      => JinqType<_U_> }               select   - alias for map
 * @property { <_U_> ((prev: _T_) => MonadType<_U_>)          => JinqType<_U_> }               inside   - maps the current value to a new {@link MonadType}
 * @property { <_U_> (monad:     MonadType<_U_>)              => JinqType<PairType<_T_,_U_>> } pairWith - combines the underlying data structure with the given data structure as {@link PairType}
 * @property { <_U_> (monadCtor: (_T_) =>  MonadType<_U_>)    => JinqType<PairType<_T_,_U_>> } combine  - combines the underlying data structure with the given constructor as {@link PairType}
 * @property {       (predicate: ConsumingPredicateType<_T_>) => JinqType<_T_> }               where    - only keeps the items that fulfill the predicate
 * @property {       ()                                       => MonadType<_T_> }              result   - returns the result of this query
 */

/**
 * JINQ (JavaScript integrated query) is the implementation of LINQ for JavaScript.
 * It can handle any data that conforms to the {@link MonadType}. Therefore, JINQ can
 * handle monadic iterables like {@link SequenceType} and every monadic type such as
 * {@link MaybeType} or {@link JsonMonad}.
 *
 * Note: Despite the similarity to SQL, it is important to note that the functionalities are not exactly the same.
 *
 * @see https://learn.microsoft.com/en-us/dotnet/csharp/linq/
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 *
 * @example
 * const devs = [ {"name": "Tobi", "salary": 0},
 *                {"name": "Michael", "salary": 50000},
 *                ...
 *              ]
 * const salaryOfMichael = devs =>
 * from(JsonMonad(devs))
 *   .where( dev => dev.name != null)
 *   .where( dev => dev.name.startsWith("Michael"))
 *   .select(dev => dev.salary)
 *   .result();
 */
const jinq = monad => ({
  pairWith:     pairWith(monad),
  combine:      combine (monad),
  where:        where   (monad),
  select:       select  (monad),
  map:          map     (monad),
  inside:       inside  (monad),
  result:       () =>    monad
});

/**
 * Serves as starting point to enter JINQ and specifies a data source.
 * Consider {@link jinq} linked below for further information.
 *
 * @see {jinq}
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 *
 * @example
 *  const range  = Range(7);
 *  const result =
 *  from(range)
 *    .where(x => x % 2 === 0)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 2 4 6'
 */
const from = jinq;


/**
 * Transforms each element of a collection using a selector function.
 *
 * @template _T_, _U_
 * @type {
 *           (monad1: MonadType<_T_>)
 *        => (selector: (_T_) => MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 *  const Person = (name, maybeBoss) => ({name, boss: maybeBoss});
 *  const ceo   = Person("Paul",  Nothing);
 *  const cto   = Person("Tom",   Just(ceo));
 *  const andri = Person("Andri", Just(cto));
 *
 * const maybeBossNameOfBoss = employee =>
 *   from(Just(employee))
 *     .inside(p => p.boss)
 *     .inside(p => p.boss)
 *     .select(p => p.name)
 *     .result();
 *
 * const maybeName = maybeBossNameOfBoss(andri);
 * const noName    = maybeBossNameOfBoss(ceo);
 *
 * assert.is(noName, Nothing);
 * maybeName
 *    (_    => console.log("No valid result"))
 *    (name => console.log(name);
 *
 * // => Logs 'Paul'
 *
 */
const inside = monad => f => {
  const processed = monad.and(f);
  return jinq(processed);
};

/**
 * Combines elementwise two {@link MonadType}s.
 * It returns a {@link PairType} which holds a combination of two values.
 *
 * @type { <_T_, _U_>
 *           (monad1: MonadType<_T_>)
 *        => (monad2: MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .pairWith(range)
 *    .where (([fst, snd]) => fst === snd)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 0 1 1 2 2 3 3'
 */
const pairWith = monad1 => monad2 => {
  const processed = monad1.and(x =>
    monad2.fmap(y => Pair(x)(y))
  );
  return jinq(processed)
};

/**
 * Combines elementwise two {@link MonadType monad}s much like
 * {@link pairWith} but the second monad is given as a constructor.
 * This allows usages that come closer to list comprehensions.
 * It returns a {@link PairType} which holds a combination of two values.
 *
 * @template _T_, _U_
 * @type { <_T_, _U_>
 *           (monad1:     MonadType<_T_>)
 *        => (monad2ctor: (arg:_T_) => MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 *  const result =
 *     from(                         Range(2, Number.MAX_VALUE)) // infinite sequence
 *       .combine( z              => Range(2, z) )
 *       .combine( ([_z, y])      => Range(2, y) )
 *       .where ( ([[ z, y ], x]) => x*x + y*y === z*z )
 *       .result()                                               // monad to sequence
 *       .take(2)                                                // lazy pruning
 *       .map ( ([[ z, y ], x]) => `${x} ${y} ${z}`)             // easy to compare
 *   ;
 *
 *   assert.is( [...result].join(" - "), "3 4 5 - 6 8 10");
 */
const combine = monad1 => monad2ctor => {
  const processed = monad1.and(x =>
    monad2ctor(x).fmap(y => Pair(x)(y))
  );
  return jinq(processed)
};

/**
 * Filters elements based on a given condition.
 *
 * @template _T_, _U_
 * @type { <_T_>
 *            (monad: MonadType<_T_>)
 *         => (predicate: ConsumingPredicateType<_T_>)
 *         => JinqType<_T_>
 *       }
 *
 * @example
 *  const range  = Range(7);
 *  const result =
 *  from(range)
 *    .where(x => x % 2 === 0)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 2 4 6'

 */
const where = monad => predicate => {
  const processed = monad.and(a => predicate(a) ? monad.pure(a) : monad.empty());
  return jinq(processed);
};

/**
 * Applies a function to each element of the collection.
 *
 * @template _T_, _U_
 * @alias map
 * @type { <_T_, _U_>
 *           (monad: MonadType<_T_>)
 *        => (selector: FunctionType<_T_, _U_>)
 *        => JinqType<_U_>
 *       }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .select(x => 2 * x)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0, 2, 4, 6'
 */
const select = monad => mapper => {
  const processed = monad.fmap(mapper);
  return jinq(processed);
};

/**
 * Applies a function to each element of the collection.
 *
 * @template _T_, _U_
 * @alias select
 * @type { <_T_, _U_>
 *           (monad: MonadType<_T_>)
 *        => (mapper: FunctionType<_T_, _U_>)
 *        => JinqType<_U_>
 *       }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .select(x => 2 * x)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0, 2, 4, 6'
 */
const map = select;
