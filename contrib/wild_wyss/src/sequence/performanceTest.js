import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import {
  cons,
  reduce$,
  SequenceBuilder,
  nil,
} from "./sequence.js";

const performanceSuite = TestSuite("PerformanceTest");

performanceSuite.add("compare SequenceBuilder and cons: SequenceBuilder 50x faster", assert => {
  const limit = 5000;

  const builderTime = measure(() => {
    const builder = SequenceBuilder();
    for (let i = 0; i < limit; i++) { builder.prepend(i); }
    const built = builder.build();
    return reduce$( (acc, cur) => acc + cur, 0)(built);
  }, "builder");

  const consTime = measure(() => {
    let consed = nil;
    for (let i = 0; i < limit; i++) { consed = cons(i)(consed)}
    return reduce$( (acc, cur) => acc + cur, 0)(consed);
  }, "Cons");

  assert.isTrue(consTime / 50 > builderTime);

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