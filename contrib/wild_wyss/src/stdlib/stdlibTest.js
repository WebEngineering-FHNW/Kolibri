import { TestSuite }     from "../test/test.js";
import { arrayEq }       from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Just, Nothing } from "../../../../docs/src/kolibri/stdlib.js";
import { catMaybes }     from "./stdlib.js";

const iteratorSuite = TestSuite("stdlib");

iteratorSuite.add("typical case: catMaybes", assert => {
  const maybes = [Nothing, Just(4), Nothing, Just(0), Nothing];
  assert.isTrue(arrayEq([4, 0])(catMaybes(maybes)));
});

iteratorSuite.add("empty list test: catMaybes", assert => {
  const maybes = [];
  assert.isTrue(arrayEq([])(catMaybes(maybes)));
});

iteratorSuite.run();
