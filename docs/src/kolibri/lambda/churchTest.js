
import { TestSuite } from "../util/test.js"

import {
    id, beta, konst, flip, kite, cmp, cmp2,
    T, F, and, not, beq, or, xor, imp, rec,
    n0, n1, n2, n3, n4, n5,
    succ, plus, mult, pow, isZero, church,
    pair, fst, snd,
    either, Left, Right,
    Nothing, Just, maybe, bindMaybe,
    curry, uncurry
} from "./church.js"

import {I, K, M, C, KI, B, BB, S, Z, Th, V} from "./ski.js";

const churchSuite = TestSuite("church");


churchSuite.add("identity", assert => {

        // identity
        assert.is( id(0) , 0);
        assert.is( id(1) , 1);
        assert.is( id , id);    // JS has function identity
        assert.isTrue( id == id);     // JS has function equality by string representation
        assert.isTrue( "x => x" == id);

        // function equivalence
        const other = x => x;
        assert.isTrue( "x => x" == other);

        const alpha = y => y;
        assert.isTrue( alpha != id );  // JS has no alpha equivalence

        // in JS, a == b && a == c  does not imply b == c
        assert.isTrue( id != other);
        assert.isTrue( id.toString() == other.toString());

        assert.is( id(id) , id);

    }
);

churchSuite.add("mockingbird", assert => {

        assert.is( M(id) , id ); // id of id is id

        assert.is("x => f(x)" , M(beta).toString()); // ???
        // M(beta) == beta => beta(beta)(beta)
        // M(beta) == beta(beta)(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => beta => beta(beta)
        // M(beta) == beta(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => x => beta(x)
        // M(beta) == x => beta(x)           // eta reduction
        // M(beta) == beta                   // qed.
        const inc = x => x + 1;
        assert.is( M(beta)(inc)(0) , beta(inc)(0)); //extensional equality


        // when loaded as an async module, this code crashes Safari and does not produce a proper s/o error
        // You can uncomment to test with a synchronous bundle.
        // try {
        //     assert.is( M(M) , M );  // recursion until s/o
        //     assert.isTrue( false );   // must not reach here
        // } catch (e) {
        //     assert.isTrue(true) // maximum call size error expected
        // }
    }
);


churchSuite.add("kestrel", assert => {

        assert.is(konst(5)(1) , 5);
        assert.is(konst(5)(2) , 5);

        assert.is(konst(id)(0) , id);
        assert.is(konst(id)(0)(1) , 1); // id(1)

    }
);


churchSuite.add("kite", assert => {

        assert.is(kite(1)(5) , 5);
        assert.is(kite(2)(5) , 5);

    }
);

churchSuite.add("flip", assert => {

        const append = x => y => x + y;
        assert.is( append("x")("y") , "xy");
        assert.is( flip(append)("x")("y") , "yx");

        const backwards = flip(append);
        assert.is( backwards("x")("y") , "yx");

    }
);


churchSuite.add("boolean", assert => {
        let bool = x => x(true)(false); // only for easier testing
        let veq = x => y => bool(beq(x)(y)); // value equality

        assert.isTrue(   bool(T) );   // sanity checks
        assert.isTrue( ! bool(F) );
        assert.isTrue(   veq(T)(T) );
        assert.isTrue( ! veq(T)(F) );
        assert.isTrue( ! veq(F)(T) );
        assert.isTrue(   veq(F)(F) );

        assert.isTrue( veq (not(T)) (F) );
        assert.isTrue( veq (not(F)) (T) );

        assert.isTrue( veq (T) (and(T)(T)) );
        assert.isTrue( veq (F) (and(T)(F)) );
        assert.isTrue( veq (F) (and(F)(T)) );
        assert.isTrue( veq (F) (and(F)(F)) );

        assert.isTrue( veq (T) (or(T)(T)) );
        assert.isTrue( veq (T) (or(T)(F)) );
        assert.isTrue( veq (T) (or(F)(T)) );
        assert.isTrue( veq (F) (or(F)(F)) );

        assert.isTrue( veq (F) (xor(T)(T)) );
        assert.isTrue( veq (T) (xor(T)(F)) );
        assert.isTrue( veq (T) (xor(F)(T)) );
        assert.isTrue( veq (F) (xor(F)(F)) );

        assert.isTrue( veq (T) (imp(T)(T)) );
        assert.isTrue( veq (F) (imp(T)(F)) );
        assert.isTrue( veq (T) (imp(F)(T)) );
        assert.isTrue( veq (T) (imp(F)(F)) );

        // addition from numerals
        assert.isTrue( veq (T) (isZero(n0)) );
        assert.isTrue( veq (F) (isZero(n1)) );
        assert.isTrue( veq (F) (isZero(n2)) );

    }
);


churchSuite.add("composition", assert => {

        const inc = x => x + 1;
        assert.is( cmp(inc)(inc)(0) , 2);

        const append = x => y => x + y;          // have an impl.
        const f2 = x => y => append(x)(y); // curried form for experiment
        const f1 = x =>      f2(x);
        const f0 =           f1;

        assert.is( f2("x")("y") , "xy");
        assert.is( f1("x")("y") , "xy");
        assert.is( f0("x")("y") , "xy");

        // explain currying sequence with paren nesting
        // const myappend = (x => (y => (append(x)) (y) ));

    }
);


churchSuite.add("recursion", assert => {

        assert.is( rec(konst(1))  , 1);
        assert.is( Z(konst(1))    , 1); // the same in terms of the Z combinator

        // hand-made recursion
        const triangle = n => n < 1 ? 0 : triangle(n-1) + n;
        assert.is( triangle(10) , 55);

        // tail recursion
        const triTail = acc => n => n < 1 ? acc : triTail(acc + n)(n-1);
        assert.is( triTail(0)(10) , 55);

        // triFun does not longer appear on the right-hand side of the recursion!
        const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
        assert.is( rec (triFun)(0)(10) , 55);
        assert.is( Z   (triFun)(0)(10) , 55); // the same in terms of the Z combinator
        assert.is( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) , 55);

        // if even works with non-tail recursion
        assert.is( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) , 55);

        // ideas for more exercises:
        // count, sum, product, (evtl later on array: none, any, every)

    }
);


churchSuite.add("numbers", assert => {

        const inc = x => x + 1;
        const nval = cn => cn(inc)(0);

        assert.is( nval(n0) , 0 );
        assert.is( nval(n1) , 1 );
        assert.is( nval(n2) , 2 );
        assert.is( nval(n3) , 3 );

        assert.is( nval( succ(n3) ) , 4 );

        assert.is( nval(n4) , 4 );
        assert.is( nval(n5) , 5 );

        assert.is( nval( succ(succ(n3))) , 3 + 1 + 1 );
        assert.is( nval( plus(n3)(n2))   , 3 + 2 );

        assert.is( nval( plus(n2)(plus(n2)(n2)) )   , 2 + 2 + 2 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );

        assert.is( nval( pow(n2)(n3) )              , 2 * 2 * 2); // 2^3
        assert.is( nval( pow(n2)(n0) )              , 1); // x^0
        assert.is( nval( pow(n2)(n1) )              , 2); // x^1
        assert.is( nval( pow(n0)(n2) )              , 0); // 0^x
        assert.is( nval( pow(n1)(n2) )              , 1); // 1^x

        assert.is( nval( pow(n0)(n0) )              , 1); // 0^0  // Ha !!!

        assert.isTrue ( nval( church(42) ) === 42 );

        const sval = cn => cn(s => 'I' + s)('');
        assert.is( sval(church(10)) , 'IIIIIIIIII');

        const qval = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        assert.is( qval(church(9)) , 81 );

        const aval = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        assert.is( aval(church(10-2)).toString() , '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        assert.is( oval(church(10)).acc , 55);  // triangle numbers

        // Thrush can be used as a one-element closure
        const closure = Th(1);  // closure is now "storing" the value until a function uses it
        assert.is( closure(id)  , 1 );
        assert.is( closure(inc) , 2 );

    }
);

churchSuite.add("pair", assert => {

        const p = pair(0)(1);      // constituent of a product type
        assert.is( fst(p)   , 0);  // p(konst) (pick first element of pair)
        assert.is( snd(p)   , 1);  // p(kite)  (pick second element of pair)

        const pval = cn => cn(p => pair(fst(p) + snd(p) + 1)(snd(p) + 1) ) ( pair(0)(0) );
        assert.is( fst(pval(church(10))) , 55);  // triangle numbers

    }
);

churchSuite.add("lazy", assert => {

        // when using church-boolean, either or maybe as control structures,
        // the branches must be lazy, or otherwise eager evaluation will call
        // both branches.

        let x = false;
        let y = false;
        T (x=true) (y=true);
        assert.isTrue(x === true && y === true); // wrong: y should be false!

        // it does *not* help to defer execution via abstraction!
        x = false;
        y = false;
        T (konst(x=true)) (konst(y=true)) ();
        assert.isTrue(x === true && y === true);// wrong: y should be false!

        // this doesn't work either
        x = false;
        y = false;
        const good = konst(x=true);
        const bad  = konst(y=true);
        T (good) (bad) ();
        assert.isTrue(x === true && y === true);// wrong: y should be false!

        // literal definition of laziness works
        x = false;
        y = false;
        T (() => (x=true)) (() => (y=true)) ();
        assert.isTrue(x === true && y === false);

        // this works
        x = false;
        y = false;
        function good2() {x=true}
        function bad2()  {y=true}
        T (good2) (bad2) ();
        assert.isTrue(x === true && y === false);

        // and this works
        x = false;
        y = false;
        const good3 = () => x=true;
        const bad3  = () => y=true;
        T (good3) (bad3) ();
        assert.isTrue(x === true && y === false);

    }
);

churchSuite.add("either", assert => {

        const left = Left(true);   // constituent of a sum type
        assert.isTrue( either (left) (id) (konst(false)) );  // left is true, right is false

        const right = Right(true);   // constituent of a sum type
        assert.isTrue( either (right) (konst(false)) (id) );  // left is false, right is true

    }
);

churchSuite.add("maybe", assert => {

        const no = Nothing;
        assert.isTrue( maybe (no) ( true ) (konst(false)) );  // test the nothing case

        const good = Just(true);
        assert.isTrue( maybe (good) ( false ) (id) );  // test the just value

        const bound = bindMaybe(Just(false))( b => Right(not(b))); // bind with not
        assert.isTrue( maybe (bound) ( false ) (id) );  // test the just value

    }
);

churchSuite.add("curry", assert => {

        function add2(x,y) { return x + y }
        const inc = curry(add2);
        assert.is( inc(1)(1) ,  2);
        assert.is( inc(5)(7) , 12);

        const add3 = uncurry(curry(add2));
        assert.is( add3(1,1) , 2 );

    }
);


churchSuite.run(); // go for the lazy eval as this will improve reporting later
