import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {emptyIterator} from "./iterator.js";
import {cons, take, map} from "./intermediateOperations.js";
import {reduce$} from "./terminalOperations.js";
import {Range} from "../range/range.js";

const iteratorSuite = TestSuite("PerformanceTest");
iteratorSuite.add("test many cons", assert => {
  let it = emptyIterator;
  const limit = 12000;
  for (let i = 0; i < limit; i++) {
    it = cons(i)(it);
  }
  console.log(reduce$( (acc, cur) => acc + cur, 0)(it));
});

iteratorSuite.add("test reduce big range", assert => {
 let it = Range(120_000_000);
 it = map(el => el * 2)(it);
  console.log("with range: " + reduce$( (acc, cur) => acc + cur, 0)(it));
});
iteratorSuite.run();
