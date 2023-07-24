import { TestSuite }     from "../test/test.js";
import { Nothing, Just } from "./maybe.js"

const maybeTestSuite = TestSuite("Maybe");

maybeTestSuite.add("test fmap", assert => {
  // Given
  const just    = Just(5);
  const nothing = Nothing;

  const mappedJust    = just.fmap(x => 2*x);
  const mappedNothing = nothing.fmap(x => 2*x);

  let justResult    = 0;
  let nothingResult = 0;

  // When
  mappedJust   (_ => justResult    = undefined )(x => justResult    = x);
  mappedNothing(_ => nothingResult = undefined )(x => nothingResult = x);

  // Then
  assert.is(justResult, 10);
  assert.is(nothingResult, undefined);
});

maybeTestSuite.add("test empty", assert => {
  // When
  const just    = Just(5);
  const nothing = Nothing;

  // Then
  assert.is(just.empty(),    Nothing);
  assert.is(nothing.empty(), Nothing);
});

maybeTestSuite.add("test and", assert => {
  // Given
  const just    = Just(5);
  const nothing = Nothing;

  const bindFn        = x => Just(2*x);
  const mappedJust    = just.and(bindFn);
  const mappedNothing = nothing.and(bindFn);

  // When
  let justResult    = 0;
  let nothingResult = 0;
  mappedJust   (_ => justResult    = undefined)(x => justResult    = x);
  mappedNothing(_ => nothingResult = undefined)(x => nothingResult = x);

  // Then
  assert.is(justResult, 10);
  assert.is(nothingResult, undefined);
});

maybeTestSuite.add("test pure", assert => {
  // Given
  const just    = Just(5);
  const nothing = Nothing;

  const mappedJust    = just   .pure(10);
  const mappedNothing = nothing.pure(10);

  // When
  let justResult    = 0;
  let nothingResult = 0;
  mappedJust   (_ => justResult    = undefined)(x => justResult    = x);
  mappedNothing(_ => nothingResult = undefined)(x => nothingResult = x);

  // Then
  assert.is(justResult,    10);
  assert.is(nothingResult, 10);
});

maybeTestSuite.run();