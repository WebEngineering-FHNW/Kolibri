import { Appender }               from "./observableAppender.js";
import { TestSuite }              from "../../test/test.js";
import { id, jsNum, snd, True }   from "../lamdaCalculus.js";
import { emptyStack, head, size } from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";

const msg1 = "Andri Wild";
const msg2 = "Tobias Wyss";

const observableAppenderSuite = TestSuite("Observable Appender");
const { trace, debug, getValue, reset } = Appender();

/**
 *
 * @param   { IObservable.<stack> } observable
 * @returns { number }
 */
const stackSize = observable => jsNum(size(observable.getValue()));
/**
 *
 * @param   { IObservable.<stack> } observable
 * @returns { String }
 */
const obsHead = observable => head(observable.getValue())(snd); // TODO: Update head documentation (return value)

observableAppenderSuite.add("test add debug log to observable appender", assert => {
  const obs     = getValue();
  const result  = debug("debug");
  assert.is(result, True);
  assert.is(obsHead(obs), "debug");
  // does the stack contain exactly one element?
  assert.is(stackSize(obs), 1);
  reset();
});

observableAppenderSuite.add("The whole stack should be retrieved when observing", assert => {
  const obs     = getValue();
  const result  = debug("debug");
  assert.is(obsHead(obs), "debug");
  assert.is(result, True);

  const result2 = trace("trace");
  assert.is(result2, True);
  assert.is(obsHead(obs), "trace");
  // The stack should contain two elements
  assert.is(stackSize(obs), 2);
  reset();
});

observableAppenderSuite.add("The reset function should clear the stack", assert => {
  const obs = getValue();
  debug("debug");

  const lastStack = reset();
  // does the stack contain no elements after reset?
  assert.is(stackSize(obs), 0);
  // Is the previous log message in the stack returned by reset?
  assert.is(obsHead(lastStack), "debug")
});

observableAppenderSuite.add("test default appender overflow implementation", assert => {
  // limit will be lifted to at least 2
  const {trace, getValue: getObservable, reset} = Appender(1);
  const result = trace(msg1);
  assert.is(stackSize(getObservable()), 1);
  assert.is(result, True);

  const result2 = trace(msg1);
  assert.is(stackSize(getObservable()), 2);
  assert.is(result2, True);

  // should trigger cache eviction & delete first element
  const result3 = trace(msg2);
  assert.is(stackSize(getObservable()), 1);
  assert.is(obsHead(getObservable()), msg2);
  assert.is(result3, True);
  reset();
});

observableAppenderSuite.add("test custom limit implementation", assert => {
  let value;
  const onLimitReached = obs => {
    value = obs.getValue();
    obs.setValue(emptyStack);
    return obs;
  };
  const {trace, reset, getValue: getObservable} = Appender(1, onLimitReached);
  trace(msg1);
  trace(msg1);
  trace(msg2);
  assert.is(jsNum(size(value)), 2);
  assert.is(jsNum(size(value)), 2);
  assert.is(obsHead(getObservable()), msg2);
  assert.is(stackSize(getObservable()), 1);
  reset();
});

observableAppenderSuite.add(
  "test appender should fallback to default eviction strategy, if array reaches limit and has not been cleaned up.",
  assert => {
    const {trace, getValue: getObservable, reset} = Appender(2, id);
    trace(msg1);
    trace(msg1);

    // should trigger default eviction strategy on next log statement
    trace(msg2);
    assert.is(stackSize(getObservable()), 2);
    assert.is(obsHead(getObservable()), msg2);
    reset();
  });

observableAppenderSuite.run();
