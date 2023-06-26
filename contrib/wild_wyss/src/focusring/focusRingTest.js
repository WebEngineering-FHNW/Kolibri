import { TestSuite } from "../test/test.js";
import { FocusRing } from "./focusRing.js";
import { Range }     from "../sequence/sequence.js";

const focusRingSuite = TestSuite("FocusRing");

focusRingSuite.add("basic access", assert => {
  // When
  const ring = FocusRing(Range(4));

  // Then
  assert.is(ring.focus(),         0);
  assert.is(ring.right().focus(), 1);
  assert.is(ring.left().focus(),  4);
});

focusRingSuite.add("test left/right combinations", assert => {
  // When
  const ring = FocusRing(Range(4));

  // Then
  assert.is(ring.left().left().focus(), 3);
  // test reverse after right
  assert.is(ring.left().right().focus(),  0);
  assert.is(ring.right().left().focus(),  0);
  assert.is(ring.right().right().focus(), 2);
});

focusRingSuite.add("test focus ring with single element", assert => {
  // When
  const ring = FocusRing(Range(0));

  // Then
  assert.is(ring.focus(),         0);
  assert.is(ring.right().focus(), 0);
  assert.is(ring.left().focus(),  0);
});

focusRingSuite.run();