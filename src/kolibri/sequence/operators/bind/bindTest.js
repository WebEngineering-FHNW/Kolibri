import { addToTestingTable }                           from "../../util/testingTable.js";
import { TestSuite }                                   from "../../../util/test.js";
import { bind, take, Sequence, PureSequence, forever } from "../../sequence.js";
import {
    createTestConfig,
    newSequence,
    UPPER_SEQUENCE_BOUNDARY
}                                                      from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation bind");

addToTestingTable(testSuite)(
  createTestConfig({
      name:          "bind",
      iterable:      () => newSequence(UPPER_SEQUENCE_BOUNDARY),
      operation:     bind,
      param:         el => take(2)(Sequence(el.toString(), forever, _ => _)),
      expected:      ["0", "0", "1", "1", "2", "2", "3", "3", "4", "4"],
      invariants: [
        it => bind(x => PureSequence(x))(it) ["=="] (it)
      ]
  })
);

testSuite.run();
