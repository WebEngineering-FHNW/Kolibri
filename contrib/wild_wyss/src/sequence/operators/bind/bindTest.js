import {addToTestingTable } from "../../util/testingTable.js";
import { bind }             from "./bind.js";
import { take }             from "../take/take.js";
import { Sequence }         from "../../constructors/sequence/Sequence.js";
import { TestSuite }        from "../../../test/test.js";
import { PureSequence }     from "../../constructors/pureSequence/pureSequence.js";
import {
    createTestConfig,
    newSequence,
    UPPER_SEQUENCE_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation bind");

addToTestingTable(testSuite)(
  createTestConfig({
      name:          "bind",
      iterable:      () => newSequence(UPPER_SEQUENCE_BOUNDARY),
      operation:     bind,
      param:         el => take(2)(Sequence(el.toString(), _ => false, _ => _)),
      expected:      ["0", "0", "1", "1", "2", "2", "3", "3", "4", "4"],
      invariants: [
        it => bind(x => PureSequence(x))(it) ["=="] (it)
      ]
  })
);

testSuite.run();