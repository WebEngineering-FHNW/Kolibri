import { TestSuite         } from "../../../test/test.js";
import { addToTestingTable } from "../../util/testingTable.js";
import { pipe              } from "./pipe.js";
import { map               } from "../map/map.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
}                            from "../../util/testUtil.js";
import {rejectAll} from "../rejectAll/rejectAll.js";
import {reduce$} from "../../terminalOperations/reduce/reduce.js";
import {arrayEq} from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";

const testSuite = TestSuite("Iterator: Operation pipe");
testSuite.run();

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "pipe",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  ops => pipe(...ops),
    param:      [ map(x => 2*x), rejectAll(x => x > 4) ],
    expected:   [0, 2, 4],
  })
);

testSuite.add("Test pipe with terminal operation", assert => {
  // Given
  const base    = newIterator(5);
  const mapper  = map        (x => 2*x);
  const reducer = reduce$    ((acc, cur) => acc + cur, 0);

  // When
  const res = pipe(
    mapper, // [0, 2, 4, 6, 8, 10]
    reducer // 0 + 0 + 2 + 4 + 6 + 8 + 10
  )(base); // [0, 1, 2, 3, 4, 5]

  //Then
  assert.is(res, 30);
});


testSuite.add("Test with no operations", assert => {
  // Given
  const base = newIterator(5);

  // When
  const res = pipe()(base);

  //Then
  assert.isTrue(arrayEq([...base])([...res]))
});

testSuite.run();
