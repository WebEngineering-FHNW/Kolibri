import { TestSuite } from "../test.js";
import { calc, calculatorHandler, result, plus, subtraction, multiplication, add, multi, sub, pow, div, churchAdd, churchMulti, churchSub, churchPow} from "../../src/calculator/calculator.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, jsNum, churchAddition, churchSubtraction, churchMultiplication} from "../../src/lambda-calculus-library/church-numerals.js";


const calculatorOperatorTest = TestSuite("λ Calculation");

calculatorOperatorTest.add("JS-Arithmetic-Operator", assert => {
    assert.equals( calculatorHandler(plus)(1)(2)(result), 3);
    assert.equals( calculatorHandler(plus)(5)(1)(result), 6);
    assert.equals( calculatorHandler(subtraction)(5)(1)(result), 4);
    assert.equals( calculatorHandler(multiplication)(5)(3)(result), 15);

    // assert.equals( calculatorOperator(plus)(2)(plus)(2)(result), 15);
});

calculatorOperatorTest.add("Church-Arithmetic-Operator", assert => {
    assert.churchNumberEquals( calculatorHandler(churchAddition)(n1)(n2)(result), n3);
    assert.churchNumberEquals( calculatorHandler(churchAddition)(n5)(n1)(result), n6);
    assert.churchNumberEquals( calculatorHandler(churchSubtraction)(n5)(n1)(result), n4);
    assert.churchNumberEquals( calculatorHandler(churchSubtraction)(n3)(n7)(result), n0);
    assert.churchNumberEquals( calculatorHandler(churchMultiplication)(n2)(n4)(result), n8);
});

const calculatorJSTest = TestSuite("Calculation with JS-Nums");

calculatorJSTest.add("basic", assert => {
    assert.equals(calc(1)(result), 1);
    assert.equals(calc(99)(result), 99);
});

calculatorJSTest.add("add", assert => {
    assert.equals(  calc(0)(add)(1)(result), 1);
    assert.equals(  calc(1)(add)(1)(result), 2);
    assert.equals(  calc(5)(add)(2)(add)(8)(result), 15 );
});

calculatorJSTest.add("sub", assert => {
    assert.equals(  calc(1)(sub)(1)(result), 0);
    assert.equals(  calc(1)(sub)(0)(result), 1);
    assert.equals(  calc(10)(sub)(25)(result), -15);
    assert.equals(  calc(20)(sub)(2)(sub)(5)(result), 13);
});

calculatorJSTest.add("multi", assert => {
    assert.equals(  calc(0)(multi)(10)(result), 0);
    assert.equals(  calc(1)(multi)(1)(result), 1);
    assert.equals(  calc(5)(multi)(2)(multi)(5)(result), 50);
});

calculatorJSTest.add("pow", assert => {
    assert.equals(  calc(0)(pow)(10)(result), 0);
    assert.equals(  calc(1)(pow)(1)(result), 1);
    assert.equals(  calc(87)(pow)(0)(result), 1);
    assert.equals(  calc(2)(pow)(1)(result), 2);
    assert.equals(  calc(2)(pow)(2)(result), 4);
    assert.equals(  calc(2)(pow)(5)(result), 32);
    assert.equals(  calc(5)(pow)(2)(result), 25);
    assert.equals(  calc(3)(pow)(2)(pow)(1)(result), 9);
});

calculatorJSTest.add("div", assert => {
    assert.equals(  calc(0)(div)(10)(result), 0); // 0/10
    assert.equals(  calc(10)(div)(0)(result), Infinity); // 10/0 divide by zero
    assert.equals(  calc(30)(div)(2)(result), 15);
    assert.equals(  calc(30)(div)(2)(div)(5)(result), 3);
    assert.equals(  calc(100)(div)(25)(div)(4)(result), 1);
});

calculatorJSTest.add("calculation", assert => {
    assert.equals(  calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result), 42 );
    assert.equals(  calc(5)(multi)(9)(add)(4)(sub)(2)(result), 47 );
    assert.equals(  calc(5)(div)(5)(multi)(100)(add)(1)(result), 101 );
    assert.equals(  calc(5)(pow)(5)(div)(5)(sub)(9)(add)(50)(result), 666  );

    assert.equals(  calc( calc(5)(pow)(2)(result) )(multi)(4)(result), 100  );
});




const calculatorChurchNumeralsTest = TestSuite("Calculation with Church-Numerals");

calculatorChurchNumeralsTest.add("basic", assert => {
    assert.equals(  calc(n1)(result), n1 );
    assert.equals(  calc(n9)(result), n9 );
});

calculatorChurchNumeralsTest.add("churchAdd", assert => {
    assert.equals(  calc(n0)(churchAdd)(n1)(result), n1);
    assert.churchNumberEquals( calc(n1)(churchAdd)(n1)(result) , n2);
    assert.churchNumberEquals(  calc(n2)(churchAdd)(n2)(churchAdd)(n4)(result), n8 );
});

calculatorChurchNumeralsTest.add("churchSub", assert => {
    assert.churchNumberEquals(  calc(n1)(churchSub)(n1)(result), n0);
    assert.churchNumberEquals(  calc(n1)(churchSub)(n3)(result), n0); // church Numerals can't be negativ, so it will be Zero (n0)
    assert.churchNumberEquals(  calc(n7)(churchSub)(n5)(result), n2);
    assert.churchNumberEquals(  calc(n9)(churchSub)(n2)(churchSub)(n5)(result), n2);
});

calculatorChurchNumeralsTest.add("churchMulti", assert => {
    assert.churchNumberEquals(  calc(n0)(churchMulti)(n7)(result), n0);
    assert.churchNumberEquals(  calc(n1)(churchMulti)(n1)(result), n1);
    assert.churchNumberEquals(  calc(n2)(churchMulti)(n2)(churchMulti)(n2)(result), n8);
});

calculatorChurchNumeralsTest.add("churchPow", assert => {
    assert.churchNumberEquals(  calc(n1)(churchPow)(n1)(result), n1);
    assert.churchNumberEquals(  calc(n6)(churchPow)(n0)(result), n1);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n1)(result), n2);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n2)(result), n4);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n3)(result), n8);
    assert.churchNumberEquals(  calc(n3)(churchPow)(n2)(result), n9);
    assert.churchNumberEquals(  calc(n3)(churchPow)(n2)(churchPow)(n1)(result), n9);
});

calculatorChurchNumeralsTest.add("church Calculation", assert => {

    assert.equals( jsNum( calc(n2)(churchAdd)(n3)(churchMulti)(n2)(churchPow)(n2)(churchSub)(n1)(result)), 99 );
    assert.equals( jsNum( calc(n5)(churchMulti)(n4)(churchSub)(n4)(churchAdd)(n9)(result)   ), 25 );
    assert.equals( jsNum( calc(n5)(churchMulti)(n9)(churchAdd)(n4)(churchSub)(n7)(result)   ), 42 );
    assert.equals( calc(n5)(churchSub)(n5)(churchMulti)(n3)(churchAdd)(n1)(result)        , n1 );
    assert.equals( jsNum(  calc(n5)(churchPow)(n5)(churchSub)(n9)(churchAdd)(  calc(n6)(churchMulti)(n7)(churchAdd)(n8)(result)  )( result) ), 3166   );
    assert.equals(  jsNum( calc(n3)(churchPow)(n4)(churchAdd)(n9)(churchAdd)(n2)(churchMulti)(n5)(result) ), 460  );

    const testCalc1 = calc( calc(n5)(churchPow)(n2)(result) )(churchMulti)(n4)(result); // 100
    const testCalc2 = calc(n3)(churchPow)(n4)(churchAdd)(n9)(churchAdd)(n2)(churchAdd)(n8)(result); // 100

    assert.equals(  jsNum( testCalc1), 100 );
    assert.equals(  jsNum( testCalc2 ), 100  );

    assert.churchNumberEquals( testCalc1 , testCalc2  );
});

calculatorOperatorTest.report();
calculatorJSTest.report();
calculatorChurchNumeralsTest.report();