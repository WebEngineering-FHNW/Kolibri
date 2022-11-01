import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./observableAppender.js";
import {snd, True} from "../lamdaCalculus.js";
import {head, size} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";


const loggerSuite = TestSuite("Observable Appender");
const { trace, debug, getValue, reset } = Appender();

loggerSuite.add("test add debug log to observable appender", assert => {
  const obs = getValue();
  let logStack;
  obs.onChange(newStack => logStack = newStack);
  const result = debug("debug");
  assert.is(result, True);
  assert.is(head(logStack)(snd), "debug"); // TODO: Dokumentation von head anpassen (Rückgabetyp)
  // does the stack contain exactly one element?
  assert.is(size(logStack)(x => x + 1)(0), 1); // TODO: replace function (churchToNumber)
  reset();
});

loggerSuite.add("The whole stack should be retrieved when observing", assert => {
  const obs = getValue();
  let logStack;
  obs.onChange((newVal, _) =>  logStack = newVal);
  const result = debug("debug");
  assert.is(head(logStack)(snd), "debug");
  assert.is(result, True);
  const result2 = trace("trace");
  assert.is(result2, True);
  assert.is(head(logStack)(snd), "trace");
  // The stack should contain two elements
  assert.is(size(logStack)(x => x + 1)(0), 2);
  reset();
});

loggerSuite.add("The reset function should clear the stack", assert => {
  const obs = getValue();
  let logStack;
  obs.onChange((newVal, _) =>  logStack = newVal);
  debug("debug");
  const lastStack = reset().getValue();
  // does the stack contain no elements after reset?
  assert.is(size(logStack)(x => x + 1)(0), 0);
  // Is the previous log messge in the stack returned by reset?
  assert.is(head(lastStack)(snd), "debug")
});

loggerSuite.run();
