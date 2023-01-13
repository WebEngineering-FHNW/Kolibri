import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { FocusRing } from "./focusRing.js";
import { Range }     from "../range/range.js";

const focusRingSuite = TestSuite("FocusRing");

focusRingSuite.add("basic access", assert => {
  const ring = FocusRing(Range(4));
  assert.is(ring.focus(),         0);
  assert.is(ring.right().focus(), 1);
  assert.is(ring.left().focus(),  4);
});

focusRingSuite.add("test left/right combinations", assert => {
  const ring = FocusRing(Range(4));
  assert.is(ring.left().left().focus(), 3);
  // test reverse after right
  assert.is(ring.left().right().focus(),  0);
  assert.is(ring.right().left().focus(),  0);
  assert.is(ring.right().right().focus(), 2);
});

focusRingSuite.add("test focus ring with single element", assert => {
  const ring = FocusRing(Range(0));
  assert.is(ring.focus(),         0);
  assert.is(ring.right().focus(), 0);
  assert.is(ring.left().focus(),  0);
});

focusRingSuite.run();