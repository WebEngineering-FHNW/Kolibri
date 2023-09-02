// noinspection SpellCheckingInspection

import { TestSuite } from "../util/test.js";
import { JsonMonad } from "./jsonMonad.js";

const jsonMonadSuite = TestSuite("JsonMonad");

jsonMonadSuite.add("test fmap mapping to list", assert => {
  // Given
  const sample2 = JSON.parse( `
  {
    "heroes": 
    [ { "kills": 47076, "name": "Atonadias" },
      { "kills": 5691,  "name": "Tanobiri" },
      { "kills": 3707,  "name": "Tonadri" } ]
  }
  `);

  // When
  const jsonMonad = JsonMonad(sample2);
  const result = [...jsonMonad.fmap(x => x["heroes"])];

  // Then
  assert.is(result.length, 3);
  assert.is(result[0]["kills"], 47076);
});

jsonMonadSuite.add("test fmap mapping to object", assert => {
  // Given
  const heroData = JSON.parse(`
  { "hero": { "kills": 47076, "name": "Atonadias" } }
  `);

  // When
  const jsonMonad = JsonMonad(heroData);
  const result = [...jsonMonad.fmap(x => x["hero"])];

  // Then
  assert.is(result[0]["kills"], 47076);
});

jsonMonadSuite.add("test fmap mapping to inexistent", assert => {
  // Given
  const heroData = JSON.parse( `
  { "hero": { "kills": 47076, "name": "Atonadias" } }
  `);

  // When
  const jsonMonad = JsonMonad(heroData);
  const result = [...jsonMonad.fmap(x => x["fears"])];

  // Then
  assert.is(result.length, 0);
});


jsonMonadSuite.add("test and", assert => {
  // Given
  const heroes = JSON.parse( `
   [{ "kills": 47076, "name": "Atonadias" },
    { "kills": 5691,  "name": "Tanobiri" },
    { "kills": 3707,  "name": "Tonadri" }]
  `);

  // When
  const jsonMonad = JsonMonad(heroes);
  const result = [...jsonMonad.and(elem => {
    const { name } = elem;
    return JsonMonad({ name });
  })];

  // Then
  assert.is(result.length, 3);
  assert.is(result[0].name, "Atonadias");
});

jsonMonadSuite.run();
