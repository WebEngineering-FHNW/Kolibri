import { TestSuite }              from "../test/test.js";
import { Just, Nothing }          from "../../../../docs/src/kolibri/stdlib.js";
import { catMaybes, choiceMaybe } from "./stdlib.js";

const iteratorSuite = TestSuite("stdlib");

iteratorSuite.add("typical case: catMaybes", assert => {
  // When
  const maybes = [Nothing, Just(4), Nothing, Just(0), Nothing];

  // Then
  assert.iterableEq([4, 0], catMaybes(maybes));
});

iteratorSuite.add("empty list test: catMaybes", assert => {
  // When
  const maybes = [];

  // Then
  assert.iterableEq([], catMaybes(maybes));
});

iteratorSuite.add("empty list test: catMaybes", assert => {
  // When
  const maybes = [];

  // Then
  assert.iterableEq([], catMaybes(maybes));
});

iteratorSuite.add("typical case: choiceMaybe", assert => {
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


iteratorSuite.add("test associativity: choiceMaybe", assert => {
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

iteratorSuite.run();