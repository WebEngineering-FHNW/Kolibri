import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { map }               from "./map.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation map");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "map",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  mapper => map(mapper),
    param:      el => 2 * el,
    expected:   [0, 2, 4, 6, 8],
    invariants: [
      it => map(x => x)(it) ["=="] (it),
      it => map(x => x[0])(map(x => [x])(it)) ["=="] (it),
    ]
  })
);

testSuite.run();
