import {TestSuite} from "../util/test.js";

import {
        n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
        succ, plus, mult, pow, isZero, churchNum, jsNum,
        leq, eq, pred, minus
} from "./churchNumbers.js";


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

        const sval = cn => cn(s => 'I' + s)('');
        assert.is(sval(churchNum(10)) , 'IIIIIIIIII');

        const inc = x => x + 1;
        const qval = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        assert.is(qval(churchNum(9)) , 81 );

        const aval = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        assert.is(aval(churchNum(10 - 2)).toString() , '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        assert.is(oval(churchNum(10)).acc , 55);  // triangle numbers

    }
);

churchNumberSuite.run();
