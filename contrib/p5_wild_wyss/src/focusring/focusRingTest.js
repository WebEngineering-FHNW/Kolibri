import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {FocusRing} from "./focusRing.js";
import {Range} from "../range/range.js";

const focusRingSuite = TestSuite("FocusRing");

focusRingSuite.add("basic access", assert => {
  const ring = FocusRing(Range(4));
  assert.is(0, ring.focus());
  assert.is(1, ring.right().focus());
  assert.is(4, ring.left().focus());
  assert.is(0, ring.left().right().focus());
  assert.is(0, ring.right().left().focus());
});

focusRingSuite.add("test reverse after right", assert => {
  const ring = FocusRing(Range(1));
  assert.is(ring.focus(),0 );
  assert.is(ring.right().focus(),1 );
  assert.is(ring.right().right().focus(), 0 );
});

focusRingSuite.add("test focus ring with single element", assert => {
  const ring = FocusRing(Range(0));
  assert.is(ring.focus(),0);
  assert.is(ring.right().focus(), 0 );
  assert.is(ring.left().focus(), 0 );
});

// focusRingSuite.add("test focus ring go left", assert => {
//
// });

focusRingSuite.run();