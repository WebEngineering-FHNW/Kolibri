import { TestSuite }  from "../../../../docs/src/kolibri/util/test.js";
import { Iterator }   from "./iterator.js";

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case for simple iterator.", assert => {
  const iterator = Iterator(0, current => current + 1, current => 0 < current);
  const [zero0, undef] = iterator;

  assert.is(zero0,0);
  assert.is(undef,undefined);
});

iteratorSuite.add("test edge case for empty iteration.", assert => {
  const iterator = Iterator(1, current => current + 1, current => 0 < current);
  const [undef]  = iterator;

  assert.is(undef,undefined);
});

iteratorSuite.add("test iterator identity.", assert => {
  const iterator = Iterator(0, current => current + 1, current => 0 < current);
  const [zero0]  = iterator;
  assert.is(zero0,0);

  const [undef] = iterator;
  assert.is(undef,undefined);
});


iteratorSuite.run();