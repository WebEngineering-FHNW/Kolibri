import { TestSuite }                from "../../../kolibri/util/test.js";
import { FocusRing }                from "./focusRing.js";
import { Range, repeat }            from "../../../kolibri/sequence/sequence.js";

const focusRingSuite = TestSuite("example/FocusRing");

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

focusRingSuite.add("a focus ring can be infinite as long as you never reach left of initial head", assert => {
  // Given
  const infinite = repeat(0);
  let ring = FocusRing(infinite);

  // When
  Range(10).forEach$(_ => ring = ring.right());
  Range( 5).forEach$(_ => ring = ring.left());  // never go further left than you have gone right

  // Then
  assert.is(ring.focus(), 0);
});

focusRingSuite.run();
