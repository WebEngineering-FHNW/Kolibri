import { TestSuite }     from "../test/test.js";
import { from }          from "./jinq.js";
import { Range }         from "../sequence/sequence.js";
import { Just, Nothing } from "../stdlib/maybe.js"
import { JsonMonad }     from "../json/jsonMonad.js";

const jinqSuite = TestSuite("Jinq Suite");

jinqSuite.add("simple with iterable", assert => {
  // Given
  const it = Range(7);

  // When
  const result =
    from(it)
      .where(x => x % 2 === 0)
      .result();

  // Then
  assert.iterableEq([0, 2, 4, 6], [...result]);
});

jinqSuite.add("pairWith with iterable", assert => {
  // Given
  const it = Range(3);

  // When
  const result =
    from(it)
      .pairWith(it)
      .where   (([fst, snd]) => fst === snd)
      .result  ();

  const values = [];
  for (const element of result) {
    values.push(...element);
  }

  // Then
  assert.iterableEq([0,0,1,1,2,2,3,3], values);
});

jinqSuite.add("select with iterable", assert => {
  // Given
  const it = Range(3);

  // When
  const result =
    from(it)
      .select(x => 2 * x)
      .result();

  // Then
  assert.iterableEq([0, 2, 4, 6], [...result]);
});

jinqSuite.add("jinq with maybe", assert => {
  // Given
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

  // When
  /**
   *
   * @param   { PersonType } employee
   * @returns { MaybeType<String, *> }
   */
  const maybeBossNameOfBoss = employee =>
    from(Just(employee))
      .inside(p => p.boss)
      .inside(p => p.boss)
      .select(p => p.name)
      .result();

  const maybeName = maybeBossNameOfBoss(andri);
  const noName    = maybeBossNameOfBoss(ceo);

  // Then
  assert.is(noName, Nothing);
  maybeName
    (_ => assert.isTrue(false))
    (n => assert.is(n, "Paul"));
});

jinqSuite.add("test pairWith with Nothing", assert => {
  // Given
  const just2 = Just(2);

  // When
  const result =
    from(just2)
      .pairWith(Nothing)
      .result();

  // Then
  assert.is(result, Nothing);
});

jinqSuite.add("json test", assert => {
  // Given
  const battleData = JSON.parse( `
    {
      "battleName": "The battle of Curly",
      "numberOfDeaths": 420000,
      "winner": { "teamName": "JSON", "outStandingHeroes": [1] },
      "loser": { "teamName": "XML", "outStandingHeroes": [] }
    }
 `);

  const heroes = JSON.parse(`
    [
      { "heroId": 1, "kills": 47076, "name": "Atonadias" },
      { "heroId": 2, "kills": 5691,  "name": "Tanobiri" },
      { "heroId": 3, "kills": 3707,  "name": "Tonadri" }
    ]
  `);

  // When
  const outstandingHeroNames =
    from(JsonMonad(battleData))
      .select   (x => x["winner"])
      .select   (x => x["outStandingHeroes"])
      .pairWith (JsonMonad(heroes))
      .where    (([heroId, hero]) => heroId === hero["heroId"])
      .select   (([_, hero]) => hero["name"])
      .result   ();

  // Then
  const results = [...outstandingHeroNames];
  assert.is(results.length, 1);
  assert.is(results[0], "Atonadias")
});

jinqSuite.run();