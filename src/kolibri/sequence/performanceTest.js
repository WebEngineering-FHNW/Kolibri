import { TestSuite } from "../util/test.js";
import {
  reduce$,
  nil,
  snoc,
}                    from "./sequence.js";
import { toSeq }     from "./util/helpers.js";

const performanceSuite = TestSuite("PerformanceTest");

performanceSuite.add("compare SequenceBuilder and cons: SequenceBuilder 50x faster", assert => {
  const limit = 5000; // reduce limit value here when running into stack overflow

  const builderTime = measure(() => {
    const builder = [];
    for (let i = 0; i < limit; i++) { builder.push(i); }
    const built = toSeq(builder);
    return reduce$( (acc, cur) => acc + cur, 0)(built);
  }, "array");

  const consTime = measure(() => {
    let consed = nil;
    for (let i = 0; i < limit; i++) { consed = snoc(i)(consed)}
    return reduce$( (acc, cur) => acc + cur, 0)(consed);
  }, "snoc ");

  assert.isTrue(consTime / 150 > builderTime);

});

const measure = (workLoad, name) => {
  const now         = performance.now();
  const result      = workLoad();
  const then        = performance.now();
  const runningTime = then - now;
  console.log(name, " took ", runningTime, "ms and produced following result: ", result);
  return runningTime;
};

performanceSuite.run();
