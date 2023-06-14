import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { cons, uncons }      from "../../../iterator/iterator.js"
import { snd  }              from "../../../../../../docs/src/kolibri/stdlib.js"
import {
  createTestConfig ,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation cons");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cons",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  cons,
    param:      2,
    expected:   [2, 0, 1, 2, 3, 4],
    invariants: [
      it => uncons(cons(1)(it))(snd)  ["=="] (it),
      it => [...cons(1)(it)].length > [...it].length,
    ],
  })
);