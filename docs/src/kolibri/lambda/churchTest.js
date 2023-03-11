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
    konst, LazyIf,
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

import { M, Th, Z }  from "./ski.js";

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

        assert.is( jsBool(T), true);   // sanity checks
        assert.is( jsBool(F), false);

        assert.is(not(T), F );
        assert.is(not(F), T );

        assert.is( T, and(T)(T) );
        assert.is( F, and(T)(F) );
        assert.is( F, and(F)(T) );
        assert.is( F, and(F)(F) );

        assert.is( T, or(T)(T) );
        assert.is( T, or(T)(F) );
        assert.is( T, or(F)(T) );
        assert.is( F, or(F)(F) );

        assert.is( F, xor(T)(T) );
        assert.is( T, xor(T)(F) );
        assert.is( T, xor(F)(T) );
        assert.is( F, xor(F)(F) );

        assert.is( T, imp(T)(T) );
        assert.is( F, imp(T)(F) );
        assert.is( T, imp(F)(T) );
        assert.is( T, imp(F)(F) );
    }
);

churchSuite.add("bool distr rule", assert => {

        // conjunctive normal form
        // (a or b) and (a or c) = a or (b and c)
        const conjNF = a => b => c =>  beq (and (or(a)(b)) (or(a)(c)))  (or (a) (and(b)(c)));

        assert.is( T, conjNF(F)(F)(F) );
        assert.is( T, conjNF(F)(F)(T) );
        assert.is( T, conjNF(F)(T)(F) );
        assert.is( T, conjNF(F)(T)(T) );
        assert.is( T, conjNF(T)(F)(F) );
        assert.is( T, conjNF(T)(F)(T) );
        assert.is( T, conjNF(T)(T)(F) );
        assert.is( T, conjNF(T)(T)(T) );

        // disjunctive normal form
        // (a and b) or (a and c) = a and (b or c)
        const disjNF = a => b => c =>  beq (or (and(a)(b)) (and(a)(c)))  (and (a) (or(b)(c)));

        assert.is( T, disjNF(F)(F)(F) );
        assert.is( T, disjNF(F)(F)(T) );
        assert.is( T, disjNF(F)(T)(F) );
        assert.is( T, disjNF(F)(T)(T) );
        assert.is( T, disjNF(T)(F)(F) );
        assert.is( T, disjNF(T)(F)(T) );
        assert.is( T, disjNF(T)(T)(F) );
        assert.is( T, disjNF(T)(T)(T) );

    }
);

churchSuite.add("bool deMorgan", assert => {
        // not (a and b) = not a or not b
        const deM1 = a => b => beq (not (and(a)(b))) (or (not(a))(not(b)));

        assert.is( T, deM1(F)(F) );
        assert.is( T, deM1(F)(T) );
        assert.is( T, deM1(T)(F) );
        assert.is( T, deM1(T)(T) );

        // not (a or b) = not a and not b
        const deM2 = a => b => beq (not (or(a)(b))) (and (not(a))(not(b)));

        assert.is( T, deM2(F)(F) );
        assert.is( T, deM2(F)(T) );
        assert.is( T, deM2(T)(F) );
        assert.is( T, deM2(T)(T) );
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

        let result;

        result = 0;
        LazyIf ( T )
            ( _=> result += 1 )  // then case
            ( _=> result += 2 ); // else case
        assert.is( result , 1 );

        result = 0;
        LazyIf ( F )
            ( _=> result += 1 )  // then case
            ( _=> result += 2 ); // else case
        assert.is( result , 2 );

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
