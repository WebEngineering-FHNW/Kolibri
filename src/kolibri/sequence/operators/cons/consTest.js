import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { cons, uncons }      from "../../sequence.js"
import { snd  }              from "../../../stdlib.js"
import {
  createTestConfig ,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation cons");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cons",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  cons,
    param:      2,
    expected:   [2, 0, 1, 2, 3, 4],
    invariants: [
      it => uncons(cons(1)(it))(snd)  ["=="] (it),
      it => [...cons(1)(it)].length > [...it].length,
    ],
  })
);
