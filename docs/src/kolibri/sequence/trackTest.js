
import { TestSuite } from "../util/test.js";
import { Track }     from "./track.js";

const trackSuite = TestSuite("sequence/walk");

trackSuite.add("empty", assert => {
    let   sideEffect = false;
    const noTrack = Track(0, _x => false, _x => {sideEffect = true; return 1;} );
    assert.is( [...noTrack].length, 0);
    assert.is( sideEffect, false);
});

trackSuite.add("single", assert => {
    let   sideEffect = false;
    const singleTrack = Track(0, x => x < 1, x => {sideEffect = true; return x + 1;} );
    assert.is( [...singleTrack].length, 1);
    assert.is( [...singleTrack][0], 0);
    assert.is( sideEffect, true);
});

trackSuite.add("range", assert => {
    let   sideEffect = false;
    const rangeTrack = Track(0, x => x < 10, x => {sideEffect = true; return x + 1;} );
    assert.is( [...rangeTrack].length, 10);
    assert.is( [...rangeTrack].toString(), "0,1,2,3,4,5,6,7,8,9");
    assert.is( sideEffect, true);
});

trackSuite.add("for-of", assert => {
    const infiniteRange = Track(0, _x => true, x => x + 1 );
    const buffer = [];
    for (const num of infiniteRange) {
        if (num > 9) break;
        if (num < 6) continue;
        buffer.push(num);
    }
    assert.is(buffer.toString(), "6,7,8,9");
});

trackSuite.add("selective-deconstruction", assert => {
    const infiniteRange = Track(0, _x => true, x => x + 1 );
    const [a,b,c] = infiniteRange;
    assert.is(a, 0);
    assert.is(b, 1);
    assert.is(c, 2);
});

trackSuite.add("varargs", assert => {
    const rangeTrack = Track(0, x => x < 10, x => x + 1 );
    const result = [];
    result.push(...rangeTrack);
    assert.is( result.length, 10);
    assert.is( result.toString(), "0,1,2,3,4,5,6,7,8,9");
});

trackSuite.add("fibonacci", assert => {
    let last = 1;
    const fibs = Track(1, x => x < 100, x => { const tmp = last; last = x; return x + tmp} );
    assert.is([...fibs].toString(), "1,2,3,5,8,13,21,34,55,89");
});


trackSuite.run();
