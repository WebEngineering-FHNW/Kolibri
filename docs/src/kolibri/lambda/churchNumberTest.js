import {TestSuite} from "../util/test.js";

import {
        n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
        succ, plus, mult, pow, isZero, churchNum, jsNum,
        leq, eq, pred, minus
}             from "./churchNumbers.js";
import {F, T} from "./church.js";


const churchNumberSuite = TestSuite("church numbers");

churchNumberSuite.add("numbers", assert => {

        assert.is(jsNum(n0) , 0 );
        assert.is(jsNum(n1) , 1 );
        assert.is(jsNum(n2) , 2 );
        assert.is(jsNum(n3) , 3 );

        assert.is(jsNum(succ(n3) ) , 4 );

        assert.is(jsNum(n4) , 4 );
        assert.is(jsNum(n5) , 5 );

        assert.is(jsNum(succ(succ(n3))) , 3 + 1 + 1 );
        assert.is(jsNum(plus(n3)(n2))   , 3 + 2 );

        assert.is(jsNum(plus(n2)(plus(n2)(n2)) )   , 2 + 2 + 2 );
        assert.is(jsNum(mult(n2)(n3) )             , 2 * 3 );
        assert.is(jsNum(mult(n2)(n3) )             , 2 * 3 );

        assert.is(jsNum(pow(n2)(n3) )              , 2 * 2 * 2); // 2^3
        assert.is(jsNum(pow(n2)(n0) )              , 1); // x^0
        assert.is(jsNum(pow(n2)(n1) )              , 2); // x^1
        assert.is(jsNum(pow(n0)(n2) )              , 0); // 0^x
        assert.is(jsNum(pow(n1)(n2) )              , 1); // 1^x

        assert.is(jsNum(pow(n0)(n0) )              , 1); // 0^0  // Ha !!!

        assert.isTrue (jsNum(churchNum(42) ) === 42 );

    }
);

churchNumberSuite.add("number operations", assert => {

        assert.is(isZero(n0), T) ;
        assert.is(isZero(n6), F) ;

        assert.is(eq(n7)(n7), T) ;
        assert.is(eq(n8)(n9), F) ;

        assert.is(leq(n7)(n7), T) ;
        assert.is(leq(n0)(n9), T) ;
        assert.is(leq(n2)(n1), F) ;

        assert.is( eq(n5)(pred(n6)), T);
        assert.is( eq(n5)(pred(n5)), F);

        assert.is( eq(n2)(minus(n6)(n4)), T);
        assert.is( eq(n2)(minus(n2)(n0)), T);
        assert.is( eq(n2)(minus(n6)(n0)), F);

        const rand = Math.ceil(Math.random() * 100);
        assert.is( eq(churchNum(rand))(churchNum(rand)),   T);
        assert.is( eq(churchNum(rand))(churchNum(rand+1)), F);
        assert.is( jsNum(churchNum(rand)), rand);
        assert.is( eq( succ(churchNum(rand))) (churchNum(rand)), F);
        assert.is( eq( pred(churchNum(rand))) (churchNum(rand)), F);
        assert.is( eq( pred(succ(churchNum(rand)))) (churchNum(rand)), T);
        assert.is( eq( succ(pred(churchNum(rand)))) (churchNum(rand)), T);
    }
);

churchNumberSuite.add("number iterations", assert => {

        const sequence = cn => cn(s => 'I' + s)('');
        assert.is(sequence(churchNum(10)) , 'I'.repeat(10));

        const inc = x => x + 1;
        const squareValue = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        assert.is(squareValue(churchNum(9)) , 81 );

        const fibValue = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        assert.is(fibValue(churchNum(10 - 2)).toString() , '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        assert.is(oval(churchNum(10)).acc , 55);  // triangle numbers

    }
);

churchNumberSuite.run();
