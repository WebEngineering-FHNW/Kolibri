import { TestSuite }   from "../test/test.js";
import { JsonWrapper } from "./JsonWrapper.js";

const jsonWrapperSuite = TestSuite("JsonWrapper");

jsonWrapperSuite.add("test fmap mapping to list", assert => {
  const sample2 = JSON.parse( `
  {
    "heroes": [
    {
      "kills": 47076,
      "name": "Atonadias"
      },
    {
      "kills": 5691,
      "name": "Tanobiri"
      },
    {
      "kills": 3707,
      "name": "Tonadri"
      }
      ]
  }
  `);
  const wrapper = JsonWrapper(sample2);
  const result = wrapper.fmap(x => x.heroes).get();

  result
    (_ => assert.isTrue(false))
    (iterator => {
      const result = [...iterator];
      assert.is(result.length, 3);
      assert.is(result[0].kills, 47076);
    });
});

jsonWrapperSuite.add("test fmap mapping to object", assert => {
  const heroData = JSON.parse( `
  {
    "hero": 
    {
      "kills": 47076,
      "name": "Atonadias"
    }
  }
  `);
  const wrapper = JsonWrapper(heroData);
  const result = wrapper.fmap(x => x.hero).get();

  result
  (_ => assert.isTrue(false))
  (iterator => {
    const result = [...iterator];
    assert.is(result[0].kills, 47076);
  });
});

jsonWrapperSuite.add("test fmap mapping to inexistent", assert => {
  const heroData = JSON.parse( `
  {
    "hero": 
    {
      "kills": 47076,
      "name": "Atonadias"
    }
  }
  `);
  const wrapper = JsonWrapper(heroData);
  const result = wrapper.fmap(x => x.fears).get();

  result
  (_ => assert.isTrue(true))
  (_ => assert.isTrue(false))
});


jsonWrapperSuite.add("test and", assert => {
  const heroes = JSON.parse( `
  [
    {
      "kills": 47076,
      "name": "Atonadias"
    },
    {
      "kills": 5691,
      "name": "Tanobiri"
    },
    {
      "kills": 3707,
      "name": "Tonadri"
    }
  ]
  `);
  const wrapper = JsonWrapper(heroes);
  const result = wrapper.and(elem => {
    const { name } = elem;
    return JsonWrapper({ name });
  }).get();

  result
    (_ => assert.isTrue(false))
    (iterator => {
      const result = [...iterator];
      assert.is(result.length, 3);
      assert.is(result[0].name, "Atonadias");
    });
});

jsonWrapperSuite.run();
