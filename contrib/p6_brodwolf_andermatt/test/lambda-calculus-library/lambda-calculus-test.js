import {TestSuite} from "../test.js";

import {id, K, KI, M, C, B, T, V, Blackbird, fst, beq, snd, and, or, not, True, False, If, pair, triple, showPair, mapPair,
    jsBool, showBoolean, firstOfTriple, secondOfTriple, thirdOfTriple, churchBool, LazyIf, Then, Else} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1, n2, n3, n4, n5, n6, n7, n8, n9, jsNum, churchAddition, churchSubtraction} from "../../src/lambda-calculus-library/church-numerals.js";

const lambdaCTest = TestSuite("Lambda Calculus");

lambdaCTest.add("identity", assert => {
    assert.equals( id(1), 1);
    assert.equals( id(n1), n1);
    assert.equals( id(true), true);
    assert.equals( id(id), id);
    assert.equals(id === id, true);
});

lambdaCTest.add("kestrel", assert => {
    assert.equals( K(1)(2), 1);
    assert.equals( K(n1)(n2), n1);
    assert.equals( K(id)(KI), id);
    assert.equals( K(K)(id), K);
    assert.equals( K(K)(id)(1)(2), 1);
});

lambdaCTest.add("kite", assert => {
    assert.equals( KI(1)(2), 2);
    assert.equals( KI(n1)(n2), n2);
    assert.equals( KI(id)(KI), KI);
    assert.equals( KI(KI)(id), id);
    assert.equals( KI(id)(KI)(1)(2), 2);
});

lambdaCTest.add("mockingbird", assert => {
    assert.equals( M(id), id);
    assert.equals( M(id)(5), 5);
    assert.equals( M(K)(5), K);
    assert.equals( M(KI)(5), 5);
    assert.equals( M(id)(KI)(2)(7), 7);
});

lambdaCTest.add("cardinal", assert => {
    assert.equals( C(fst)(1)(2), 2);
    assert.equals( C(snd)(1)(2), 1);
    assert.equals( (C(snd)(id)(7))(6), 6);
    assert.equals( (C(snd)(id)(7))(id), id);
    assert.equals( C(fst)(id)(7), 7);
});

lambdaCTest.add("bluebird", assert => {
    const f = x => x + 1;
    const g = x => x * 2;

    assert.equals( B(f)(g)(4), 9);
    assert.equals( B(g)(f)(4), 10);
    assert.equals( B(id)(id)(5), 5);
    assert.equals( B(f)(id)(5), 6);
    assert.equals( B(id)(g)(5), 10);
});

lambdaCTest.add("thrush", assert => {
    const f = x => x + 1;

    assert.equals( T(2)(f), 3);
    assert.equals( T(2)(id), 2);
    assert.equals( T(id)(id), id);
    assert.churchNumberEquals( T(n2)(n3), n8);
    assert.churchNumberEquals( T(n3)(n2), n9);
});

lambdaCTest.add("vireo / pair", assert => {
    assert.equals(V, pair);

    const pairNumber = pair(1)(2);
    const pairString = pair("Hello")("World");
    const pairChurchNr = pair(n1)(n5);

    assert.equals(pairNumber(fst), 1 );
    assert.equals(pairNumber(snd), 2 );

    assert.equals(pairString(fst) ,                         "Hello"       );
    assert.equals(pairString(fst) + pairString(snd), "HelloWorld"   );

    assert.equals( pairChurchNr(fst) , n1);
    assert.churchNumberEquals( pairChurchNr(fst) , n1);

    assert.equals( pairChurchNr(snd) ,                   n5  );
    assert.churchNumberEquals( pairChurchNr(snd) ,       n5  );
    assert.equals( jsNum( pairChurchNr(snd) ) , 5   );
});

lambdaCTest.add("blackbird", assert => {
    assert.equals(  Blackbird(id)(x => y => x + y)(2)(3),  5);


    const add = x => y => x + y;
    const multiplyWithTwo = x => x * 2;

    const churchAddFive = churchAddition(n5);

    assert.equals( Blackbird(multiplyWithTwo)(add)(2)(3),       10  );
    assert.equals( Blackbird(multiplyWithTwo)(add)(10)(20),     60  );

    assert.equals( jsNum(Blackbird(churchAddFive)(churchAddition)(n3)(n7)),     15  );
    assert.equals( jsNum(Blackbird(churchAddFive)(churchSubtraction)(n9)(n7)),  7   );
});

lambdaCTest.add("convert to js-bool", assert => {
    assert.equals( jsBool(True),    true    );
    assert.equals( jsBool(False),   false   );
});

lambdaCTest.add("convert to church-bool", assert => {
    assert.equals( churchBool(true),    True    );
    assert.equals( churchBool(false),   False   );
});

lambdaCTest.add("if", assert => {
    assert.equals( If( True)            ("Hello World")  ("Bye bye World"),"Hello World"    );
    assert.equals( If( False)           ("Hello World")  ("Bye bye World"), "Bye bye World" );
    assert.equals( If( or(True)(False) )("is truthy")    ("nope"),          "is truthy"     );
    assert.equals( If( and(True)(True) )("Really truthy")("nope"),          "Really truthy" );

});

lambdaCTest.add("LazyIf", assert => {
    const sayName = name => console.log("hello: " + name);

    const LazyIf = condition => truthy => falshy => (condition(truthy)(falshy))();

    const result = () => LazyIf(True)
                        (Then(() => sayName("Peter")))
                        (Else(() => sayName("should not be executed")));

    assert.consoleLogEquals(result, "hello: Peter");
});

lambdaCTest.add("show boolean", assert => {
    assert.equals( showBoolean(True),   'True'  );
    assert.equals( showBoolean(False),  'False' );
});

lambdaCTest.add("boolean and", assert => {
    assert.equals( and(True)(True),     True    );
    assert.equals( and(False)(True),    False   );
    assert.equals( and(True)(False),    False   );
    assert.equals( and(False)(False),   False   );

    assert.equals( or(and(False)(False))(True), True    );
    assert.equals( and(or(True)(False))(True),  True    );
});

lambdaCTest.add("boolean or", assert => {
    assert.equals( or(True)(True),      True    );
    assert.equals( or(False)(True),     True    );
    assert.equals( or(True)(False),     True    );
    assert.equals( or(False)(False),    False   );
});

lambdaCTest.add("boolean not", assert => {
    assert.churchBooleanEquals( not(True),                       False  );
    assert.churchBooleanEquals( not(False),                      True   );
    assert.churchBooleanEquals( not(not(False)),                 False  );
    assert.churchBooleanEquals( not(not(True)),                  True   );
    assert.churchBooleanEquals( not(and(True)(or(False)(True))), False  );
});

lambdaCTest.add("boolean equality", assert => {
    assert.churchBooleanEquals( beq(True)(True),    True    );
    assert.churchBooleanEquals( beq(False)(False),  True    );
    assert.churchBooleanEquals( beq(True)(False),   False   );
    assert.churchBooleanEquals( beq(False)(True),   False   );
});

lambdaCTest.add("show pair", assert => {
    const p1 = pair(2)(3);
    const p2 = pair("Hello")("World");
    const p3 = pair(x => x)(x => y => x);

    assert.equals( showPair(p1), '2 | 3');
    assert.equals( showPair(p2), 'Hello | World');
    assert.equals( showPair(p3), 'x => x | x => y => x');
});

lambdaCTest.add("map pair", assert => {
    const p1 = pair(2)(3);
    const p2 = pair("Hello")("World");

    const f = x => x * 4;
    const g = x => x + '!';

    assert.equals( showPair(mapPair(f)(p1)), '8 | 12');
    assert.equals( showPair(mapPair(g)(p2)), 'Hello! | World!');
});

lambdaCTest.add("triple", assert => {
    const testTripel = triple(1)(2)(3);

    assert.equals( testTripel(firstOfTriple), 1);
    assert.equals( testTripel(secondOfTriple), 2);
    assert.equals( testTripel(thirdOfTriple), 3);
});

lambdaCTest.add("first of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals( firstOfTriple(0)(1)(2), 0);
    assert.equals( firstOfTriple(2)(1)(0), 2);
    assert.equals( firstOfTriple(id)(1)(2), id);
    assert.equals( firstOfTriple(id(testObject))(1)(2), testObject);
    assert.equals( firstOfTriple(testArray)(1)(2), testArray);
});

lambdaCTest.add("second of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals( secondOfTriple(0)(1)(2), 1);
    assert.equals( secondOfTriple(2)(1)(0), 1);
    assert.equals( secondOfTriple(5)(id)(4), id);
    assert.equals( secondOfTriple(2)(id(testArray))(1), testArray);
    assert.equals( secondOfTriple(2)(testObject)(1), testObject);
});

lambdaCTest.add("third of triple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals( thirdOfTriple(0)(1)(2), 2);
    assert.equals( thirdOfTriple(2)(1)(0), 0);
    assert.equals( thirdOfTriple(5)(4)(id), id);
    assert.equals( thirdOfTriple(2)(1)(id(testObject)), testObject);
    assert.equals( thirdOfTriple(2)({name: "test"})(testArray), testArray);
});


lambdaCTest.report();
