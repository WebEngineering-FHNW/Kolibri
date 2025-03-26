import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { zip, nil }          from "../../sequence.js"
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";
import { Pair, fst, snd }    from "../../../lambda/churchExports.js";

const testSuite = TestSuite("Sequence: operation zip");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "zip",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  zip,
    param:      newSequence(UPPER_SEQUENCE_BOUNDARY),
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

testSuite.add("test advanced case: zip one iterable is shorter", assert => {
  // Given
  const it1 = newSequence(UPPER_SEQUENCE_BOUNDARY);
  const it2 = newSequence(2);

  // When
  const zipped1 = zip(it2)(it1); // first iterable is shorter
  const zipped2 = zip(it1)(it2); // second iterable is shorter

  // Then
  assert.is([...zipped1].length, 3);
  assert.is([...zipped2].length, 3);
});

testSuite.run();
