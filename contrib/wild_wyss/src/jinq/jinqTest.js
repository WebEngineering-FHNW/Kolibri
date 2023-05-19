import {TestSuite} from "../test/test.js";
import {from} from "./jinq.js";
import {Range} from "../range/range.js";
import {arrayEq} from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import {fst, snd} from "../../../../docs/src/kolibri/lambda/church.js";
import {Just, Nothing} from "../stdlib/maybe.js"
import {JsonWrapper} from "../json/JsonWrapper.js";

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
      .where(pair => pair(fst) === pair(snd))
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

jinqSuite.add("jinq with maybe", assert => {
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

jinqSuite.add("json test", assert => {
  const battleData = JSON.parse( `
    {
      "battleName": "The battle of Curly",
      "numberOfDeaths": 420000,
      "winner": {
        "teamName": "JSON",
        "outStandingHeroes": [1]
      },
      "loser": {
        "teamName": "XML",
        "outStandingHeroes": []
      }
    }
 `);

  const heroes = JSON.parse( `
    [
      {
        "heroId": 1,
        "kills": 47076,
        "name": "Atonadias"
      },
      {
        "heroId": 2,
        "kills": 5691,
        "name": "Tanobiri"
      },
      {
        "heroId": 3,
        "kills": 3707,
        "name": "Tonadri"
      }
    ]
  `);

  const outstandingHeroNames =
    from(JsonWrapper(battleData))
      .select(x => x["winner"])
      .select(x => x["outStandingHeroes"])
      .join  (JsonWrapper(heroes))
      .where (tuple => tuple(fst) === tuple(snd)["heroId"])
      .select(tuple => tuple(snd))
      .select(hero  => hero["name"])
      .result()
      .get   ();

  outstandingHeroNames
    (_ => assert.isTrue(false))
    (x => {
      const results = [...x];
      assert.is(results.length, 1);
      assert.is(results[0], "Atonadias")
    })
});


jinqSuite.run();