import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { Pair, fst, snd }    from "../../../../../../docs/src/kolibri/stdlib.js";
import { zip, nil }          from "../../iterator.js"
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation zip");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "zip",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  zip,
    param:      newIterator(UPPER_ITERATOR_BOUNDARY),
    expected:   [Pair(0)(0), Pair(1)(1), Pair(2)(2), Pair(3)(3), Pair(4)(4)],
    evalFn:     expected => actual => {
      const expectedArray = [...expected];
      const actualArray = [...actual];
      let result = true;
      for (let i = 0; i < expectedArray.length; i++) {
        result = result && actualArray[i](fst) === expectedArray[i](fst);
        result = result && actualArray[i](snd) === expectedArray[i](snd);
      }
      return result;
    },
    invariants: [
      it => zip(it)(nil) ["=="] (nil),
      it => zip(nil)(it) ["=="] (nil)
    ]
  })
);

testSuite.add("test advanced case: zip one iterator is shorter", assert => {
  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = newIterator(2);
  const zipped1 = zip(it2)(it1); // first iterator is shorter
  const zipped2 = zip(it1)(it2); // second iterator is shorter

  assert.is([...zipped1].length, 3);
  assert.is([...zipped2].length, 3);
});

testSuite.run();