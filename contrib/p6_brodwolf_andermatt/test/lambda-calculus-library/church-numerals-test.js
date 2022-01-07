import {TestSuite} from "../test.js";

import { id, True, False, fst, snd, pair } from "../../src/lambda-calculus-library/lambda-calculus.js";
import {
    n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, pred, phi, is0, churchNum, jsNum,
    churchAddition, churchSubtraction, churchMultiplication, churchPotency,
    leq, eq, gt, max, min
} from "../../src/lambda-calculus-library/church-numerals.js";

const churchTest = TestSuite("Church Numerals");

churchTest.add("numbers", assert => {
    assert.equals( n2(id)(4), 4);
    assert.equals( n2(x => x * 2)(1), 4);
    assert.equals( n3(x => x + '!')('Hello World'), 'Hello World!!!');
    assert.equals( n5(x => x * x)(2), 4294967296 );
    assert.equals( n5(x => id(x))(n7), n7 );
    assert.equals( n1( x => x + ' Calculus')('λ'), "λ Calculus");
    assert.equals( n9( x => x + ' Ta')('Trrrr'), "Trrrr Ta Ta Ta Ta Ta Ta Ta Ta Ta");
});

churchTest.add("succ", assert => {
    assert.churchNumberEquals(succ(n0), n1);
    assert.churchNumberEquals(succ(n5), n6);
    assert.equals(jsNum(succ(n9)), 10);
});

churchTest.add("pre", assert => {
    assert.churchNumberEquals( pred(n1), n0 );
    assert.churchNumberEquals( pred(n5), n4 );
    assert.equals( pred(n0), n0);
});

churchTest.add("phi", assert => {
    const testPair      = pair(n1)(n2);
    const testPhiPair   = phi(testPair);

    assert.churchNumberEquals( testPhiPair(fst), n2 );
    assert.churchNumberEquals( testPhiPair(snd), n3 );

    assert.churchNumberEquals( n1(phi) (pair(n0)(n0)) (fst), n0 );
    assert.churchNumberEquals( n1(phi) (pair(n0)(n0)) (snd), n1 );

    assert.churchNumberEquals( n0(phi) (testPair) (fst), n1 );
    assert.churchNumberEquals( n0(phi) (testPair) (snd), n2 );

    assert.churchNumberEquals( n1(phi) (testPair) (fst), n2 );
    assert.churchNumberEquals( n1(phi) (testPair) (snd), n3 );

    assert.churchNumberEquals( n6(phi) (testPair) (fst), n7 );
    assert.churchNumberEquals( n6(phi) (testPair) (snd), n8 );


    const testPair2     = pair(n7)(n3);
    const testPhiPair2  = phi(testPair2);

    assert.churchNumberEquals( testPhiPair2(fst), n3 );
    assert.churchNumberEquals( testPhiPair2(snd), n4 );

    assert.churchNumberEquals( n0(phi) (testPair2) (fst), n7 );
    assert.churchNumberEquals( n0(phi) (testPair2) (snd), n3 );

    assert.churchNumberEquals( n1(phi) (testPair2) (fst), n3 );
    assert.churchNumberEquals( n1(phi) (testPair2) (snd), n4 );

    assert.churchNumberEquals( n6(phi) (testPair2) (fst), n8 );
    assert.churchNumberEquals( n6(phi) (testPair2) (snd), n9 );

    const testPair3     = pair(n9)(n9);
    const testPhiPair3  = phi(testPair3);

    assert.churchNumberEquals( testPhiPair3(fst), n9 );
    assert.equals( jsNum(testPhiPair3(snd)), 10 );
});

churchTest.add("pred", assert => {
    assert.churchNumberEquals( pred(n0), n0 );
    assert.churchNumberEquals( pred(n1), n0 );
    assert.churchNumberEquals( pred(n2), n1 );
    assert.churchNumberEquals( pred(n9), n8 );
});

churchTest.add("isZero", assert => {
    assert.equals( is0(n0), True );
    assert.equals( is0(n1), False );
    assert.equals( is0(n2), False );
    assert.equals( is0(n9), False );
});

churchTest.add("churchNum", assert =>{
   assert.churchNumberEquals( churchNum( 0),  n0);
   assert.churchNumberEquals( churchNum( 1),  n1);
   assert.churchNumberEquals( churchNum( 5),  n5);
   assert.churchNumberEquals( churchNum( 7),  n7);
   assert.churchNumberEquals( churchNum( 9),  n9);
   assert.churchNumberEquals( churchNum( 25), churchMultiplication(n5)(n5));
   assert.churchNumberEquals( churchNum( 54), churchMultiplication(n9)(n6));
   assert.churchNumberEquals( churchNum( 42), churchMultiplication(n6)(n7));
});


churchTest.add("jsNum", assert => {
    assert.equals( jsNum(n0) , 0);
    assert.equals( jsNum(n1) , 1);
    assert.equals( jsNum(n2) , 2);
    assert.equals( jsNum(n3) , 3);
    assert.equals( jsNum(n4) , 4);
    assert.equals( jsNum(n5) , 5);
    assert.equals( jsNum(n6) , 6);
    assert.equals( jsNum(n7) , 7);
    assert.equals( jsNum(n8) , 8);
    assert.equals( jsNum(n9) , 9);

    assert.equals( jsNum( churchAddition(n9)(n9) ), 18);
    assert.equals( jsNum( churchAddition(n6)(n8) ), 14);
    assert.equals( jsNum( churchMultiplication(n9)(n9) ), 81);
    assert.equals( jsNum( churchPotency(n2)(n5) ), 32);
    assert.equals( jsNum( churchSubtraction(n9)(n4) ), 5);
});

churchTest.add("church less or equal", assert => {
    assert.churchBooleanEquals(  leq(n0)(n0) , True  );

    assert.churchBooleanEquals(  leq(n0)(n1) , True  );
    assert.churchBooleanEquals(  leq(n1)(n1) , True  );
    assert.churchBooleanEquals(  leq(n2)(n1) , False  );

    assert.churchBooleanEquals(  leq(n5)(n1) , False  );
    assert.churchBooleanEquals(  leq(n5)(n5) , True  );
    assert.churchBooleanEquals(  leq(n5)(n8) , True  );
});

churchTest.add("church equal", assert => {
    assert.churchBooleanEquals(  eq(n0)(n0) , True  );

    assert.churchBooleanEquals(  eq(n0)(n1) , False  );
    assert.churchBooleanEquals(  eq(n1)(n1) , True  );
    assert.churchBooleanEquals(  eq(n2)(n1) , False  );

    assert.churchBooleanEquals(  eq(n5)(n1) , False  );
    assert.churchBooleanEquals(  eq(n5)(n5) , True  );
    assert.churchBooleanEquals(  eq(n5)(n8) , False  );
});

churchTest.add("church greater than", assert => {
    assert.churchBooleanEquals(  gt(n0)(n0) , False  );

    assert.churchBooleanEquals(  gt(n0)(n1) , False  );
    assert.churchBooleanEquals(  gt(n1)(n1) , False  );
    assert.churchBooleanEquals(  gt(n2)(n1) , True  );

    assert.churchBooleanEquals(  gt(n5)(n1) , True  );
    assert.churchBooleanEquals(  gt(n5)(n5) , False  );
    assert.churchBooleanEquals(  gt(n5)(n8) , False  );
});

churchTest.add("max", assert => {
    assert.churchNumberEquals(  max(n0)(n0) , n0  );
    assert.churchNumberEquals(  max(n1)(n0) , n1  );
    assert.churchNumberEquals(  max(n0)(n5) , n5  );
    assert.churchNumberEquals(  max(n5)(n5) , n5  );
    assert.churchNumberEquals(  max(n5)(n6) , n6  );
    assert.churchNumberEquals(  max(n7)(n6) , n7  );
});
churchTest.add("min", assert => {
    assert.churchNumberEquals(  min(n0)(n0) , n0  );
    assert.churchNumberEquals(  min(n1)(n0) , n0  );
    assert.churchNumberEquals(  min(n0)(n5) , n0  );
    assert.churchNumberEquals(  min(n5)(n5) , n5  );
    assert.churchNumberEquals(  min(n5)(n6) , n5  );
    assert.churchNumberEquals(  min(n7)(n6) , n6  );
});

churchTest.report();

