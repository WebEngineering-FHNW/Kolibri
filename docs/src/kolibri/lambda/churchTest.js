import {TestSuite} from "../util/test.js";

import {
        and,
        beq,
        beta,
        c, Choice,
        churchBool,
        cmp,
        curry,
        either,
        F,
        flip,
        fst,
        id,
        imp,
        jsBool,
        Just,
        kite,
        konst,
        Left,
        maybe,
        not,
        Nothing,
        or,
        Pair,
        rec,
        Right,
        snd,
        T, Tuple,
        uncurry,
        xor
} from "./church.js";

import {I, M, Th, Z,}  from "./ski.js";

const churchSuite = TestSuite("church");

churchSuite.add("identity", assert => {

        // noinspection EqualityComparisonWithCoercionJS
        const weekEq = (a, b) => a == b;

        // identity
        assert.is( id(0) , 0);
        assert.is( id(1) , 1);
        assert.is( id , id);                  // JS has function identity
        assert.isTrue( weekEq("x => x", id)); // JS has weak function equivalence by string representation

        // function equivalence
        const other = x => x;
        assert.isTrue( weekEq("x => x", other));

        const alpha = y => y;
        assert.isTrue( ! weekEq(alpha, id ));  // JS has no alpha equivalence

        // in JS, a == b && a == c  does not imply b == c
        assert.isTrue( ! weekEq(id, other));
        assert.isTrue( weekEq(id.toString(), other.toString()));
    }
);

churchSuite.add("mockingbird", assert => {
        assert.is( M(id) , id ); // id of id is id

        assert.is("x => f(x)" , M(beta).toString()); // ???

        const inc = x => x + 1;
        assert.is( M(beta)(inc)(0) , beta(inc)(0)); //extensional equality

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

        assert.isTrue(   jsBool(churchBool(true)));
        assert.isTrue( ! jsBool(churchBool(false)));

        const veq  = x => y => jsBool(beq(x)(y)); // value equality

        assert.isTrue(   jsBool(T) );   // sanity checks
        assert.isTrue( ! jsBool(F) );
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

        // triFun does no longer appear on the right-hand side of the recursion!
        const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
        assert.is( rec (triFun)(0)(10) , 55);
        assert.is( Z   (triFun)(0)(10) , 55); // the same in terms of the Z combinator
        assert.is( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) , 55);

        // if even works with non-tail recursion
        assert.is( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) , 55);
    }
);


churchSuite.add("deferred operations", assert => {

        // Thrush can be used as a one-element closure
        const closure = Th(1);  // closure is now "storing" the value until a function uses it
        assert.is( closure(id)  , 1 );
        assert.is( closure(x => x+1) , 2 );

    }
);

churchSuite.add("Pair", assert => {
        const p = Pair(0)(1);      // constituent of a product type
        assert.is( p(fst)   , 0);  // p(konst) (pick first element of pair)
        assert.is( p(snd)   , 1);  // p(kite)  (pick second element of pair)
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

        // todo dk: try with Thrush

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

        assert.isTrue( maybe (Nothing)   (c(true) )  (c(false)) );  // test the nothing case

        assert.isTrue( maybe (Just(true)) (c(false)) (id) );  // test the just value

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

churchSuite.add("Tuple border cases", assert => {

     try {
         Tuple(-1);
         assert.isTrue(false); // must not reach here
     } catch (expected) {
         assert.isTrue(true);
     }

     try {
         Tuple(0);
         assert.isTrue(false); // must not reach here
     } catch (expected) {
         assert.isTrue(true);
     }
});

churchSuite.add("tuple3", assert => {

     const [Person, firstname, lastname, age] = Tuple(3);

     const dierk = Person("Dierk")("König")(50);

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");
     assert.is(dierk(age),       50);

});

churchSuite.add("choice", assert => {

    const [Cash, CreditCard, Transfer] = Choice(3); // generalized sum type

    const pay = payment => payment                  // "pattern" match
        (() =>
             amount => 'pay ' + amount + ' cash')
        (({number, sec}) =>
             amount => 'pay ' + amount + ' with credit card ' + number + ' / ' + sec)
        (([from, to]) =>
             amount => 'pay ' + amount + ' by wire from ' + from + ' to ' + to);

    let payment = Cash();
    assert.is(pay(payment)(50), 'pay 50 cash');

    payment = CreditCard({number: '0000 1111 2222 3333', sec: '123'});
    assert.is(pay(payment)(50), 'pay 50 with credit card 0000 1111 2222 3333 / 123');

    payment = Transfer(['Account 1', 'Account 2']);
    assert.is(pay(payment)(50), 'pay 50 by wire from Account 1 to Account 2');

});


churchSuite.run();
