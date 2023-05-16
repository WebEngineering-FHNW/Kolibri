import {TestSuite} from "../test/test.js";
import {from} from "./jinq.js";
import {Range} from "../range/range.js";
import {arrayEq} from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import {fst, snd} from "../../../../docs/src/kolibri/lambda/church.js";
import {Just, Nothing} from "../stdlib/maybe.js"

const jinqSuite = TestSuite("Jinq Suite");

jinqSuite.add("simple with iterator", assert => {
 const it = Range(7);
 const result =
   from(it)
   .where(x => x % 2 === 0)
   .result();

  assert.isTrue(arrayEq([0, 2, 4, 6])([...result]))
});

jinqSuite.add("join with iterator", assert => {
  const it = Range(3);
  const result =
    from(it)
      .join(it)
      .where(x => x(fst) === x(snd))
      .result();

  const values = [];
  for (const pair of result) {
    values.push(pair(fst), pair(snd));
  }

  assert.isTrue(arrayEq([0,0,1,1,2,2,3,3])([...values]));
});

jinqSuite.add("select with iterator", assert => {
  const it = Range(3);
  const result =
    from(it)
      .select(x => 2 * x)
      .result();

  assert.isTrue(arrayEq([0, 2, 4, 6])([...result]))
});

jinqSuite.add("", assert => {
  /**
   * @typedef PersonType
   * @property { String } name
   * @property { MaybeType<PersonType, *> } boss
   */

  /**
   *
   * @param { String } name
   * @param { MaybeType<PersonType> } maybeBoss
   * @returns { PersonType }
   * @constructor
   */
  const Person = (name, maybeBoss) => ({name, boss: maybeBoss});
  const ceo   = Person("Paul",  Nothing);
  const cto   = Person("Tom",   Just(ceo));
  const andri = Person("Andri", Just(cto));
  const tobi  = Person("Tobi",  Just(cto));

  /**
   *
   * @param   { PersonType } employee
   * @returns { MaybeType<String, *> }
   */
  const maybeBossNameOfBoss = employee =>
    from(Just(employee))
      .fromIn(p => p.boss)
      .fromIn(p => p.boss)
      .select(p => p.name)
      .result();

  const maybeName = maybeBossNameOfBoss(andri);
  const noName = maybeBossNameOfBoss(ceo);
  assert.is(noName, Nothing);
  maybeName
    (_ => assert.isTrue(false))
    (n => assert.is(n, "Paul"));
});

jinqSuite.add("test join with Nothing", assert => {
  const just2 = Just(2);
  const result =
    from(just2)
      .join(Nothing)
      .result();
  assert.is(result, Nothing);

});
jinqSuite.run();