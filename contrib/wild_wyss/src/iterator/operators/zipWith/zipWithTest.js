import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { zipWith, nil } from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation zipWith");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "zipWith",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  zipper => zipWith(zipper)(newIterator(UPPER_ITERATOR_BOUNDARY)),
    param:      (i, j) => i + j,
    expected:   [0, 2, 4, 6, 8],
    invariants: [
      it => zipWith(x => x)(nil)(it) ["=="] (nil),
      it => zipWith(x => x)(it)(nil) ["=="] (nil),
    ]
  })
);

testSuite.add("test advanced case: zipWith one iterator is shorter", assert => {
  let iterationCount = 0;

  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = newIterator(2);
  const zipper = (i, j) => {
    iterationCount++;
    return i + j;
  };
  const zipped1 = zipWith(zipper)(it2)(it1); // first iterator is shorter
  const zipped2 = zipWith(zipper)(it1)(it2); // second iterator is shorter

  for (const _ of zipped1) { /* Exhausting*/ }
  assert.is(iterationCount, 3);

  for (const _ of zipped2) { /* Exhausting*/ }
  assert.is(iterationCount, 6);
});

testSuite.run();