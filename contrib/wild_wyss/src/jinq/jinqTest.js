import {TestSuite} from "../test/test.js";
import {from} from "./jinq.js";
import {Range} from "../range/range.js";
import {arrayEq} from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import {fst, snd} from "../../../../docs/src/kolibri/lambda/church.js";

const jinqSuite = TestSuite("Jinq Suite");

jinqSuite.add("simple", assert => {
 const it = Range(7);
 const result =
   from(it)
   .where(x => x % 2 === 0)
   .result();

  assert.isTrue(arrayEq([0, 2, 4, 6])([...result]))
});

jinqSuite.add("simple", assert => {
  const it = Range(3);
  const result = from(it).join(it).where(x => x(fst) === x(snd)).result();
  //
  const values = [];
  for (const pair of result) {
    values.push(pair(fst), pair(snd));
  }

  assert.isTrue(arrayEq([0,0,1,1,2,2,3,3])([...values]));
});

jinqSuite.add("simple", assert => {
  const it = Range(3);
  const result =
    from(it)
      .select(x => 2 * x)
      .result();

  assert.isTrue(arrayEq([0, 2, 4, 6])([...result]))
});
jinqSuite.run();