import { churchAddition, churchSubtraction, churchMultiplication, churchPotency } from '../lambda-calculus-library/church-numerals.js'
import {id, T} from '../lambda-calculus-library/lambda-calculus.js'
export {calc, calculatorHandler, result, plus, subtraction, multiplication, add, multi, sub, pow, div, churchAdd, churchMulti, churchSub, churchPow}

/**
 * Generic Types
 * @typedef {function} operator
 * @typedef {*} number
 * @typedef {number} jsNumber
 * @typedef {function} fn
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/** -----------------------------------------------------
 * --------- Calculator (JS- & Church-Numbers) ----------
 * ------------------------------------------------------
 */

/**
 * operator -> jsChurchNumber -> jsChurchNumber -> fn -> fn( operator(jsChurchNumber)(jsChurchNumber) ) ; CalculatorOperator - handle the arithmetic-operator
 * @param {operator} op
 * @return { function(n:churchNumber|number): function(k:churchNumber|number): function(f:function) : function} JS- or Chruch-Arithmetic-Operation
 */
const calculatorHandler = op => n => k => f => f(op(n)(k));

/**
 * calc ; start the Calculator
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @param {churchNumber|number} number
 * @returns {operator} Operator
 */
const calc = T;

/**
 * result ; end the Calculator and return the result
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @return {churchNumber|number} ChurchNumber / JsNumber
 */
const result = id;


/** ----------------------------------------------------
 * -------------  Calculation with JS-Numbers ----------
 * ------------------------------------------------------
 */

/**
 * JavaScript Arithmetic-Operators
 */
const plus              = n => k => n + k;
const multiplication    = n => k => n * k;
const subtraction       = n => k => n - k;
const exponentiation    = n => k => n ** k;
const division          = n => k => n / k;

/**
 * Combining the JavaScript-Arithmetic to the CalculatorOperator
 * and creating Arithmetic-Function to us with the Calc-Function.
 *
 * @example
 * calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result) === 42
 */
const add   = calculatorHandler(plus);
const multi = calculatorHandler(multiplication);
const sub   = calculatorHandler(subtraction);
const pow   = calculatorHandler(exponentiation);
const div   = calculatorHandler(division);


/** ----------------------------------------------------
 * ----------  Calculation with Church-Numbers ---------
 * -----------------------------------------------------
 */

/**
 * Combining the Church-Arithmetic to the CalculatorOperator
 * and creating Arithmetic-Function to us with the Calc-Function.
 *
 * @example
 * calc(n2)(churchAdd)(n3)(churchMulti)(n2)(churchPow)(n2)(churchSub)(n1)(result) ==> 99
 */
const churchAdd     = calculatorHandler(churchAddition);
const churchMulti   = calculatorHandler(churchMultiplication);
const churchPow     = calculatorHandler(churchPotency);
const churchSub     = calculatorHandler(churchSubtraction);

