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

jinqSuite.add("object test", assert => {

  /**
   *
   * @param obj
   * @return {}
   * @constructor
   */
  const JsonWrapper = obj => {

    /**
     *
     * @param {}maybeObj
     * @return {any}
     * @constructor
     */
    const JsonWrapperFactory = maybeObj => {

      const pure = a => JsonWrapperFactory(Just(a));

      const empty = () => JsonWrapperFactory(Nothing);

      const fmap = f => {
       const result = maybeObj.and(x => {
         const result = f(x);
         return result ? Just(result): Nothing;
       });
       return JsonWrapperFactory(result);
      };

      // x => x.adress
      // f :: _T_ -> JsonWrapper<_U_>
      const and = f => {

       const result = maybeObj.and(x => {
         const result = f(x);
         return result.get();
       });
       return JsonWrapperFactory(result);
      };

      const get = () => maybeObj;

      return {
        pure,
        empty,
        fmap,
        and,
        get,
      }
    };

    return JsonWrapperFactory(Just(obj));
  };


  const sample = JSON.parse( `
  {
    "address": {
      "address": "629 Debbie Drive",
        "city": "Nashville",
        "coordinates": {
        "lat": 36.208114,
          "lng": -86.58621199999999
      },
      "postalCode": "47076",
        "state": "TN"
    },
    "department": "Marketing",
      "name": "Blanda-O'Keefe",
      "title": "Help Desk Operator"
  }
  `);

  const sample2 = JSON.parse( `
  {
    "people": [
    {
      "postalCode": "47076",
      "name": "Atoandias"
      },
      
    {
      "postalCode": "47076",
      "name": "Tanobiri"
      },
    {
      "postalCode": "37076",
      "name": "Drk"
      }
      ]
  }
  `);


  const wrapper =
    from(JsonWrapper(sample))
      .select(x => x.address)
      .select(x => x.postalCode)
      .result()
      .get();
  wrapper(x => console.log("nothing"))(x => console.log("just: " + x));

  const wrapper2 =
    from(JsonWrapper(sample))
      .select(x => x.address)
      .select(x => x.postalCode)
      .join(JsonWrapper(sample2))
      .where(tuple => {
        console.log(tuple(fst), tuple(snd));
       return  tuple(fst) === tuple(snd).postalCode
      })
      .result()
      .get();
  wrapper2(x => console.log("nothing"))(x => console.log("just: " + x))

});


jinqSuite.run();