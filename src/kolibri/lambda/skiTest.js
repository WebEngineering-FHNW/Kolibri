import {TestSuite}                   from "../util/test.js"
import {I, K, C, KI, B, BB, V, S}    from "./ski.js";
import {id, c, cmp, cmp2, snd, flip} from "./church.js";
import {Pair}                        from "./pair.js";

const skiSuite = TestSuite("lambda/ski");

skiSuite.add("aliases", assert => {
    assert.is(I,  id);
    assert.is(K,  c);
    assert.is(C,  flip);
    assert.is(KI, snd);
    assert.is(B,  cmp);
    assert.is(BB, cmp2);
    assert.is(V,  Pair);
});

skiSuite.add("SKK is I", assert => {
    const v = Math.random();
    assert.is(S(K)(K)(v),  I(v));
});

skiSuite.run();
