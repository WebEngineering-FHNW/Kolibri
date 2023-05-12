import { TestSuite } from "../test/test.js";
import { Nothing, Just } from "./either.js"
const eitherTestSuite = TestSuite("Either");


eitherTestSuite.add("test fmap", assert => {
  const just    = Just(5);
  const nothing = Nothing;

  const mappedJust    = just.fmap(x => 2*x);
  const mappedNothing = nothing.fmap(x => 2*x);

  let justResult    = 0;
  let nothingResult = 0;
  mappedJust(_ => justResult = undefined )(x => justResult = x);
  mappedNothing(_ => nothingResult = undefined )(x => nothingResult = x);

  assert.is(justResult, 10);
  assert.is(nothingResult, undefined);
});

eitherTestSuite.add("test empty", assert => {
  const just    = Just(5);
  const nothing = Nothing;
  assert.is(just.empty(), Nothing);
  assert.is(nothing.empty(), Nothing);
});

eitherTestSuite.add("test and", assert => {
  const just    = Just(5);
  const nothing = Nothing;

  const bindFn = x => Just(2*x);
  const mappedJust    = just.and(bindFn);
  const mappedNothing = nothing.and(bindFn);

  let justResult    = 0;
  let nothingResult = 0;
  mappedJust(_ => justResult = undefined)(x => justResult = x);
  mappedNothing(_ => nothingResult = undefined)(x => nothingResult = x);

  assert.is(justResult, 10);
  assert.is(nothingResult, undefined);
});

eitherTestSuite.add("test pure", assert => {
  const just    = Just(5);
  const nothing = Nothing;

  const mappedJust    = just.pure(10);
  const mappedNothing = nothing.pure(10);

  let justResult    = 0;
  let nothingResult = 0;
  mappedJust(_ => justResult = undefined)(x => justResult = x);
  mappedNothing(_ => nothingResult = undefined)(x => nothingResult = x);

  assert.is(justResult, 10);
  assert.is(nothingResult, 10);
});
eitherTestSuite.run();