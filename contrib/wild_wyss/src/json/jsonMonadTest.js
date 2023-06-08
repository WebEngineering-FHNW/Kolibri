import { TestSuite } from "../test/test.js";
import { JsonMonad } from "./jsonMonad.js";
import { Pair }      from "../stdlib/pair.js";

const jsonMonadSuite = TestSuite("JsonMonad");

jsonMonadSuite.add("test fmap mapping to list", assert => {
  const sample2 = JSON.parse( `
  {
    "heroes": 
    [ { "kills": 47076, "name": "Atonadias" },
      { "kills": 5691,  "name": "Tanobiri" },
      { "kills": 3707,  "name": "Tonadri" } ]
  }
  `);
  const jsonMonad = JsonMonad(sample2);
  const result = [...jsonMonad.fmap(x => x["heroes"])];


      assert.is(result.length, 3);
      assert.is(result[0]["kills"], 47076);
});

jsonMonadSuite.add("test fmap mapping to object", assert => {
  const heroData = JSON.parse(`
  { "hero": { "kills": 47076, "name": "Atonadias" } }
  `);
  const jsonMonad = JsonMonad(heroData);
  const result = [...jsonMonad.fmap(x => x["hero"])];

  assert.is(result[0]["kills"], 47076);
});

jsonMonadSuite.add("test fmap mapping to inexistent", assert => {
  const heroData = JSON.parse( `
  { "hero": { "kills": 47076, "name": "Atonadias" } }
  `);
  const jsonMonad = JsonMonad(heroData);
  const result = [...jsonMonad.fmap(x => x["fears"])];

  assert.is(result.length, 0);
});


jsonMonadSuite.add("test and", assert => {
  const heroes = JSON.parse( `
   [{ "kills": 47076, "name": "Atonadias" },
    { "kills": 5691,  "name": "Tanobiri" },
    { "kills": 3707,  "name": "Tonadri" }]
  `);
  const jsonMonad = JsonMonad(heroes);
  const result = [...jsonMonad.and(elem => {
    const { name } = elem;
    return JsonMonad({ name });
  })];

  assert.is(result.length, 3);
  assert.is(result[0].name, "Atonadias");
});

jsonMonadSuite.run();
