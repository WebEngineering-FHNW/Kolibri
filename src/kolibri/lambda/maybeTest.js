// noinspection DuplicatedCode

import { TestSuite }            from "../util/test.js";
import { Nothing, Just }        from "./maybe.js"
import {catMaybes, choiceMaybe} from "./maybe.js";

const maybeTestSuite = TestSuite("lambda/Maybe");

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


maybeTestSuite.add("typical case: catMaybes", assert => {
  // When
  const maybes = [Nothing, Just(4), Nothing, Just(0), Nothing];

  // Then
  assert.iterableEq([4, 0], catMaybes(maybes));
});

maybeTestSuite.add("empty list test: catMaybes", assert => {
  // When
  const maybes = [];

  // Then
  assert.iterableEq([], catMaybes(maybes));
});

maybeTestSuite.add("empty list test: catMaybes", assert => {
  // When
  const maybes = [];

  // Then
  assert.iterableEq([], catMaybes(maybes));
});

maybeTestSuite.add("typical case: choiceMaybe", assert => {
  // Given
  const just = Just(1);
  const just2 = Just(2);
  const nothing = Nothing;

  // Then
  /*
    There are 4 possible cases to be considered:
    Nothing <|> Nothing = Nothing -- 0 results + 0 results = 0 results
    Just x  <|> Nothing = Just x  -- 1 result  + 0 results = 1 result
    Nothing <|> Just x  = Just x  -- 0 results + 1 result  = 1 result
    Just x  <|> Just y  = Just x  -- 1 result  + 1 result  = 1 result:
   */
  assert.is(choiceMaybe(nothing)(nothing), nothing);
  assert.is(choiceMaybe(just)   (nothing), just);
  assert.is(choiceMaybe(nothing)(just),    just);
  assert.is(choiceMaybe(just)   (just2),   just);
});


maybeTestSuite.add("test associativity: choiceMaybe", assert => {
  // Given
  const just1 = Just(1);
  const just2 = Just(2);
  const just3 = Just(3);

  // When
  // choice must be associative
  const case1 = choiceMaybe(choiceMaybe(just1)(just2))(just3);
  const case2 = choiceMaybe(just1)(choiceMaybe(just2(just3)));

  // Then
  assert.is(case1, case2);
});

maybeTestSuite.run();
