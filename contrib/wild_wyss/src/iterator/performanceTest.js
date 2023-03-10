import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {emptyIterator} from "./iterator.js";
import {cons, take} from "./intermediateOperations.js";

const iteratorSuite = TestSuite("PerformanceTest");
iteratorSuite.add("", assert => {
  let it = emptyIterator;
  const limit = 1000000;
  for (let i = 0; i < limit; i++) {
    it = cons(i)(it);
  }
  console.log(...take(1)(it));
});

iteratorSuite.run();
