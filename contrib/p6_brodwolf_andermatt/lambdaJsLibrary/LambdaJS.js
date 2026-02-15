/*
-----  Lambdas Calculus Library
 */

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} triple
 * @typedef {function} churchBoolean
 */


/**
 * x -> x ; Identity (id)
 *
 * @lambda λx.x
 * @haskell Identity :: a -> a
 * @function Identity
 * @param   {*} x
 * @returns {*} x
 */
const I = x => x;
const id = I;

/**
 * a -> b -> a ; Kestrel (Constant)
 *
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 * @function Konstant
 * @param    {*} x
 * @returns  {function(y:*): function(x:*)} a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 *
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 * @function Kite
 * @param    {*} x
 * @returns  {function(y:*): function(y:*)} a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda  λf.ff
 * @haskell Mockingbird :: f -> f
 * @function Mockingbird
 * @param   {function} f
 * @returns {function({ f: { f } })} a self-application combinator
 */
const M = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 *
 * @lambda  λfxy.fxy
 * @haskell Cardinal :: f -> a -> b -> pair
 * @function Cardinal
 * @function flip
 * @param    {function} f
 * @returns  { function(x:*): function(y:*): {f: { y x }} } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 * @example
 * C(K) (1)(2)  === 2
 * C(KI)(1)(21) === 1
 */
const C = f => x => y => f(y)(x);


/**
 * f -> g -> x -> f( g( x ) ) ; Bluebird (Function composition)
 *
 * @lambda λfgx.f(gx)
 * @haskell Bluebird :: f -> a -> b -> c
 * @function Bluebird
 * @param   {function} f
 * @returns { function(g:function): function(x:*):  {f: { g:{x} } } } two-fold self-application composition
 * @example
 * B(id)(id)(n7)     === n7
 * B(id)(jsnum)(n7)  === 7
 * B(not)(not)(True) === True
 */
const B = f => g => x => f(g(x));


/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 *
 * @lambda  λxf.fx
 * @haskell Thrush :: a -> f -> b
 * @function Thrush
 * @param    {*} x
 * @returns  {function(f:function): {f: {x} }} self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f (x)(y) ; Vireo (hold pair of args)
 *
 * @lambda  λxyf.fxy
 * @haskell Vireo :: a -> b -> f -> c
 * @function Vireo
 * @param    {*} x
 * @returns  {function(y:*): function(f:function): {f: {x y} }}
 */
const V = x => y => f => f(x)(y);


/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 *
 * @lambda  λfgxy.f(gxy)
 * @haskell Blackbird :: f -> g -> a -> b -> c
 * @function
 * @param   {function} f
 * @returns {function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} })}
 * @example
 * Blackbird(x => x)    (x => y => x + y)(2)(3) === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 *
 * @function
 * @type    churchBoolean
 * @return  KI
 */
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 *
 * @function
 * @type    churchBoolean
 * @return  K
 */
const True = K;

/**
 * Syntactic sugar for creating a If-Then-Else-Construct
 * Hint: Better use LazyIf to avoid that JavaScript eagerly evaluate both cases (then and else).
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * If( eq(n1)(n1) )
 *  (Then( "same"     ))
 *  (Else( "not same" ))
 */
const If = condition => truthy => falsy => condition(truthy)(falsy);

/**
 * Syntactic sugar for creating a If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Add in 'Then' and 'Else' a anonym function: () => "your function"
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * LazyIf( eq(n1)(n1) )
 *  (Then( () => "same"     ))
 *  (Else( () => "not same" ))
 */
const LazyIf = condition => truthy => falsy => (condition(truthy)(falsy))();

/**
 * Syntactic sugar for If-Construct
 */
const Then = I;
const Else = I;

/**
 * f -> x -> y -> f( x )( y ) ; not ; Cardinal
 *
 * @function
 * @param   {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not( True      )("a")("b")  === "b"
 * not( False     )("a")("b")  === "a"
 * not( not(True) )("a")("b")  === "a"
 */
const not = C;

/**
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function(q:churchBoolean): churchBoolean}  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function(q:churchBoolean): churchBoolean}  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function( q:churchBoolean): churchBoolean}  True or False
 * @example
 * beq(True)(True)   === True;
 * beq(True)(False)  === False;
 * beq(False)(False) === False;
 */
const beq = p => q => p(q)(not(q));

/**
 * b -> b("True")("False") ; showBoolean
 *
 * @function
 * @param  {churchBoolean} b
 * @return {string} - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; jsBool
 *
 * @function
 * @param   {churchBoolean} b
 * @return  {boolean} - true or false
 * @example
 * jsBool(True)  === true;
 * jsBool(False) === false;
 */
const jsBool = b => b(true)(false);

/**
 * b => b ? True : False ; churchBool
 *
 * @function
 * @param   {boolean} b
 * @return  {churchBoolean} - True or False
 * @example
 * churchBool(true)  === True;
 * churchBool(false) === False;
 */
const churchBool = b => b ? True : False;

/**
 * x -> y -> f -> f(x)(y) ; Pair
 *
 * @function
 * @param   {*} x:  firstOfPair argument of the pair
 * @returns {function(y:*): function(f:function): {f: {x y} }} - returns a function, that store two value
 */
const pair = V;

/**
 * Get first value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): x} - pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * Get second value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): y} - pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;

/**
 * x -> y -> z -> f -> f(x)(y)(z) ; Triple
 *
 * @function
 * @param  {*} x - firstOfTriple argument of the Triple
 * @return {function(y:*):  function(z:*): function(f:function): {f: {x y z}}} - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);

/**
 * @haskell firstOfTriple :: a -> b -> c -> a
 *
 * x -> y -> z -> x ; firstOfTriple
 *
 * @function
 * @param  {*} x
 * @return {function(y:*): function(z:*): x} - x
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 1
 */
const firstOfTriple = x => y => z => x;

/**
 * x -> y -> z -> y ; secondOfTriple
 *
 * @function
 * @param  {*} x
 * @return {function(y:*): function(z:*): y} - y
 * @example
 * triple(1)(2)(3)(secondOfTriple) === 2
 */
const secondOfTriple = x => y => z => y;

/**
 * x -> y -> z -> z ; thirdOfTriple
 *
 * @function
 * @param {*} x
 * @return {function(y:*): function(z:*): z} - z
 * @example
 * triple(1)(2)(3)(thirdOfTriple) === 3
 */
const thirdOfTriple = x => y => z => z;

/**
 * function -> pair -> pair
 *
 * @function
 * @param  {function} f
 * @return {function(pair): function(Function): {f: {x, y}}} new mapped pair
 * @example
 * mapPair( x => x+3 )( pair(1)(2) ) === pair(4)(5)
 * mapPair( x => x + "!!!" )( pair("Yes")("No") ) === pair("Yes!!!")("No!!!")
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 *
 * @function
 * @param  {pair} p
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;

/*
-----  Church Numerals
 */

/**
 * Generic Types
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/**
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0 = f => a => a;
const n1 = f => a => f(a);
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

/**
 * successor of a church number (with bluebird)
 *
 * @lambda λnfa.f(nfa)
 * @haskell successor :: Number -> a -> b -> Number
 *
 * @function successor
 * @param   {churchNumber} n
 * @returns {function(f:function): churchNumber} successor of n
 */
const succ = n => f => B(f)(n(f));

/**
 * Addition with two Church-Numbers
 *
 * @lambda λnk.n( λnfa.f(nfa) )k
 * @haskell churchAddition :: Number -> Number -> Number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 * @param   {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchMultiplication = B;

/**
 * Potency with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 *
 * @function
 * @param  {churchNumber} n
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a js number to a church number
 *
 * @function
 * @param   {number} n
 * @returns {churchNumber} church number of n
 */
const churchNum = n => n === 0 ? n0 : succ(churchNum(n - 1));

/**
 * converts a church number to a js number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {number} js number of n
 * @example
 * jsNum(n0) === 0
 * jsNum(n1) === 1
 * jsNum(n2) === 2
 * jsNum(n3) === 3
 */
const jsNum = n => n(x => x + 1)(0);


/**
 * "less-than-or-equal-to" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));

/**
 * "greater-than" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);

/**
 * max of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const max = n => k => gt(n)(k)(n)(k)

/**
 * min of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const min = n => k => leq(n)(k)(n)(k)

/*
-----  Calculator
 */

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


/*
-----  Stack
 */

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {function} maybe
 * @typedef {function} either
 * @typedef {function} churchNumber
 * @typedef {number}   jsNumber
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function
 * @type stack
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @function
 * @type stack
 * @return {stack} emptyStack
 */
const emptyStack = stack(n0)(id)(id);

/**
 * A help function to create a new stack
 *
 * @function
 * @param  {function} f
 * @return {stack} stack
 */
const startStack = f => f(emptyStack);

/**
 * stack getter function - get the Index (first of a triple)
 *
 * @haskell stackIndex :: a -> b -> c -> a
 * @function
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @haskell stackPredecessor :: a -> b -> c -> b
 * @function
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;

/**
 * stack getter function - get the Value (third of a triple)
 *
 * @haskell stackValue :: a -> b -> c -> c
 * @function
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;

/**
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 *
 * @haskell: hasPre :: a -> churchBoolean
 * @function hasPredecessor
 * @param  {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and returns the predecessor stack
 *
 * @haskell getPreStack :: stack -> stack
 * @function getPredecessorStack
 * @param  {stack} s
 * @return {stack} predecessor stack of that stack
 */
const getPreStack = s => s(stackPredecessor)

/**
 * A function that takes a stack and a value.
 * The function returns a new stack with the pushed value.
 *
 * @haskell push :: stack -> a -> stack
 * @param  {stack} s
 * @return {stack} stack with value x
 */
const push = s => stack(succ(s(stackIndex)))(s);

/**
 * A function that takes a stack and returns a value pair.
 * The first element of the pair is the predecessor stack.
 * The second element of the pair is the head (the top element) of the stack.
 *
 * @haskell pop :: stack -> pair
 * @param  {stack} s
 * @return {pair} pair
 */
const pop = s => pair(getPreStack(s))(head(s));

/**
 * A function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @haskell head :: stack -> a
 * @function
 * @param  {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack. The function returns the index (aka stack-size) of the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const getStackIndex = s => s(stackIndex);

/**
 * A function that takes a stack and returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} size (stack-index) as church numeral
 */
const size = getStackIndex;

/**
 * A function that takes a reduce-function, the initial reduce value and a stack.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: reduceFn ->initialValue -> stack -> a
 * @function
 * @param  {function} reduceFn
 * @return {function(initialValue:*): function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * const reduceFunctionSum = acc => curr => acc + curr;
 * reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          ===  3
 * reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) ===  5
 *
 * reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          ===  8
 * reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = acc => curr => [...acc, curr];
 * reduce( reduceToArray )( [] )( stackWithNumbers ) === [0, 1, 2]
 */
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc)(curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If( hasPre(stack) )
        (Then( getTriple(argsTriple) ))
        (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
    (reduceIteration)
    (triple
        (s)
        (acc => curr => push(acc)(curr))
        (emptyStack)
    )
    (thirdOfTriple);

    return times
    (reduceIteration)
    (triple
        (reversedStack)
        (reduceFn)
        (initialValue)
    )(thirdOfTriple);
};

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns the element at the passed index or undefined incl. a Error-Log to the Console
 *
 * @haskell getElementByIndex :: stack -> number -> a
 * @sideeffect Logs a error when index is no Church- or JS-Number or valid number
 * @function
 * @param {stack} stack
 * @return {function(index:churchNumber|jsNumber) : * } stack-value or undefined when not exist or invalid
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( 0 ) === id
 * getElementByIndex( stackWithNumbers )( 1 ) ===  0
 * getElementByIndex( stackWithNumbers )( 2 ) ===  1
 * getElementByIndex( stackWithNumbers )( 3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === undefined // strings not allowed, throws a Console-Warning
 */
const getElementByIndex = stack => index =>
    eitherElementByIndex(stack)(index)
    (console.error)
    (id);

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByIndex :: stack -> number -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * eitherElementByIndex( stackWithNumbers )( n0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )( n1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )( n2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )( n3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )(  0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )(  1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )(  2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )(  3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )( "im a string" )(id)(id) === "getElementByIndex - TypError: index value 'im a string' (string) is not allowed. Use Js- or Church-Numbers"
 */
const eitherElementByIndex = stack => index =>
    eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => eitherElementByChurchIndex(stack)(index) )
                (_ => eitherElementByJsNumIndex (stack)(index) )
            ))
    (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
        (id) // return value

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByChurchIndex :: stack -> churchNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByChurchIndex = stack => index =>
    eitherFunction(index)
    (_ => Left(`getElementByIndex - TypError: index value '${index}' (${typeof index}) is not allowed. Use Js- or Church-Numbers`))
    (_ => eitherNotNullAndUndefined( getElementByChurchNumberIndex(stack)(index) )
    (_ => Left("invalid index"))
    (e => Right(e))               );

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByJsNumIndex :: stack -> jsNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByJsNumIndex = stack => index =>
    eitherNotNullAndUndefined( getElementByJsNumIndex(stack)(index) )
    (_ => Left("invalid index"))
    (e => Right(e)                );

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:churchNumber) : *} stack-value
 */
const getElementByChurchNumberIndex = s => i =>
    If( leq(i)(size(s)))
    (Then( head( ( churchSubtraction(size(s))(i) )(getPreStack)(s))))
    (Else(undefined));

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:Number) : *} stack-value
 */
const getElementByJsNumIndex = s => i => {
    if (i < 0){ return undefined; } // negativ index are not allowed

    const times = succ(size(s));
    const initArgsPair = pair(s)(undefined);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        return (jsNum(getStackIndex(stack)) === i)
            ? result(head(stack))
            : result(argsPair(snd));

    };
    return (times
        (getElement)(initArgsPair)
    )
    (snd);
};

/**
 * A function that takes a stack and an element. The function returns the index (ChurchNumber) of the element from the passed stack.
 * Returns undefined when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchNumber|undefined} a ChurchNumber or undefined
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getIndexOfElement( stackWithNumbers )(  0 ) === n1
 * getIndexOfElement( stackWithNumbers )(  1 ) === n2
 * getIndexOfElement( stackWithNumbers )(  2 ) === n3
 * getIndexOfElement( stackWithNumbers )( 42 ) === undefined
 */
const getIndexOfElement = s => element => {

    const getIndex = argsPair => {
        const stack  = argsPair(fst);
        const result = pair(getPreStack(stack));

        return If( churchBool(head(stack) === element))
        (Then( result(getStackIndex(stack)) ) )
        (Else( result(argsPair(snd))        ) );
    }

    const times        = succ(size(s));
    const initArgsPair = pair(s)(undefined);

    return (times
        (getIndex)(initArgsPair)
    )
    (snd);
}

/**
 * A function that takes a stack and an element. The function returns a maybe-Monade Just with the index (ChurchNumber) of the element from the passed stack.
 * Returns Nothing when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*): either} Just(withIndex) or Nothing
 */
const maybeIndexOfElement = s => element => {
    const result = getIndexOfElement(s)(element)
    return result === undefined
        ? Nothing
        : Just(result);
}

/**
 * A function that takes a stack and an element.
 * Returns True (ChurchBoolean) when element does exist in the stack.
 * Returns False (ChurchBoolean) when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchBoolean } True or False
 */
const containsElement = s => element =>
    maybeIndexOfElement(s)(element)
    ( () => False )
    ( () => True  );

/**
 *  A function that takes an stack and converts the stack into an array. The function returns an array
 *
 * @param  {stack} s
 * @return {Array} Array
 * @example
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertStackToArray = reduce(acc => curr => [...acc, curr])([]);

/**
 * A function that takes an javascript array and converts the array into a stack. The function returns a stack.
 *
 * @param  {Array} array
 * @return {stack} stack
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertArrayToStack = array =>
    array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * A function that takes an some Element and converts into a stack. The function returns a stack
 *
 * @param  {...*} elements
 * @return {stack} stack
 * const stackWithValues = convertElementsToStack( 1,2,3 )
 * convertStackToArray( stackWithValues ) === [1,2,3]
 *
 * const stackWithValues2 = convertElementsToStack( 1,2,3,...['a','b','c'] )
 * convertStackToArray( stackWithValues2 ) === [1,2,3,'a','b','c']
 */
const convertElementsToStack = (...elements) =>
    convertArrayToStack(elements);

/**
 * A function that accepts a stack and returns as a reversed stack.
 *
 * @param  {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s =>
    reduce(acc => _ => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))(s)(snd);

/**
 *  A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param  {function} mapFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const mapWithReduce = mapFunc =>
    reduce(acc => curr => push(acc)(mapFunc(curr)))(emptyStack);

/**
 *  A function that accepts a stack and a filter function. The function returns the filtered stack.
 *
 * @param  {function} filterFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const filterWithReduce = filterFunc =>
    reduce(acc => curr => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack);

/**
 *  A function that takes a map function and a stack. The function returns the mapped stack
 *
 * @param  {function} mapFunction
 * @return {function(s:stack): stack} stack
 * @example
 * const stackWithNumbers = convertArrayToStack([2,5,6])
 *
 * const stackMultiplied  = map( x => x * 2)(stackWithNumbers)
 *
 * getElementByIndex( stackMultiplied )( 1 ) ===  4
 * getElementByIndex( stackMultiplied )( 2 ) === 10
 * getElementByIndex( stackMultiplied )( 3 ) === 12
 */
const map = mapFunction => s => {

    const mapIteration = argsPair => {
        const _stack       = argsPair(snd);
        const _mappedValue = mapFunction(head(_stack));
        const _resultStack = push(argsPair(fst))(_mappedValue);
        return pair(_resultStack)(getPreStack(_stack));
    };

    const times        = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
        (mapIteration)(initArgsPair)
    )
    (fst);
};

/**
 * A function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 * @example
 * const stackWithNumbers = convertArrayToStack([42,7,3])
 *
 * filter(x => x < 20 && x > 5)(stackWithNumbers) === convertArrayToStack([7])
 */
const filter = filterFunction => s => {

    const filterIteration = argsPair => {
        const _stackFilter    = argsPair(fst);
        const _stack          = argsPair(snd);
        const _nextValueStack = getPreStack(_stack)
        const _stackCurrValue = head(_stack);

        if (filterFunction(_stackCurrValue)) {
            const resultStack = push(_stackFilter)(_stackCurrValue);
            return pair(resultStack)(_nextValueStack);
        }

        return pair(_stackFilter)(_nextValueStack);
    };

    const times = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
        (filterIteration)(initArgsPair)
    )
    (fst);
};

/**
 * A function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
 *
 * @function
 * @sideffect log to Console
 * @param {stack} stack
 */
const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)));

/**
 * stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param   {stackOp} stackOp
 * @returns {function(s:stack): function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f =>
    f(stackOp(s)(x));

/**
 * pushToStack is a Stack-Builder-Command to push new values to the current stack
 *
 * @function
 * @param   {stackOpBuilder} stackOp
 * @returns {function(pushToStack)} pushToStack
 * @example
 * const stackOfWords = convertArrayToStack(["Hello", "World"])
 *
 * getElementByIndex( stackOfWords )( 1 ) === "Hello"
 * getElementByIndex( stackOfWords )( 2 ) === "World"
 */
const pushToStack = stackOpBuilder(push);

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 */
const forEachOld = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if (jsBool(hasPre(s))) {
            const element = head(s);
            const index = jsNum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times
    (iteration)(reversedStack);
};

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 *
 * @function
 * @param stack
 * @return {function(callbackFunc:function): void}
 * @example
 * const stackWithNumbers = convertArrayToStack([5,10,15])
 *
 * forEach( stackWithNumbers )( (element, index) => console.log("At Index " + index + " is the Element " + element) );
 *
 * // Console-Output is:
 * // At Index 1 is the Element 5
 * // At Index 2 is the Element 10
 * // At Index 3 is the Element 15
 */
const forEach = stack => callbackFunc => {

    const invokeCallback = p => {
        const _stack   = p(fst);
        const _index   = p(snd);
        const _element = head(_stack);

        callbackFunc(_element, _index);

        return pair( getPreStack(_stack) )(_index + 1 );
    }

    const iteration = p =>
        If( hasPre(p(fst)) )
        (Then( invokeCallback(p) ))
        (Else(                p  ));

    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    times
    (iteration)( pair(reversedStack)(1) );
};

/**
 * The removeByIndex function takes a stack and a Church- or JS-Number as an index.
 * The function deletes the element at the passed index and returns the new stack.
 * If the index does not exist, the same stack is returned.
 *
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : stack } stack
 * @example
 * const stackWithStrings = convertArrayToStack(["Hello", "Haskell", "World"]);
 *
 * removeByIndex(stackWithStrings)(  2 )     // [ "Hello", "World" ]
 * removeByIndex(stackWithStrings)( n2 )     // [ "Hello", "World" ]
 */
const removeByIndex = stack => index => {

    const removeByCondition = currentStack => resultStack => index => currentIndex => {
        const currentElement    = head(currentStack);
        const result            = If( eq(index)(currentIndex) )
        (Then( resultStack ))
        (Else( push( resultStack )( currentElement )));

        return triple
        ( getPreStack(currentStack) )
        ( result                    )
        ( succ(currentIndex)        );
    }

    const removeElementFn = stack => index => {
        const times         = size(stack);
        const reversedStack = reverseStack(stack);

        const iteration = argsTriple => {
            const currentStack = argsTriple(firstOfTriple);
            const resultStack  = argsTriple(secondOfTriple);
            const currentIndex = argsTriple(thirdOfTriple);

            return If(hasPre(currentStack))
            (Then( removeByCondition(currentStack)(resultStack)(index)(currentIndex) ))
            (Else( argsTriple                                                        ));
        }

        return times
        (iteration)
        (triple
            ( reversedStack )
            ( emptyStack    )
            ( n1            )
        )
        (secondOfTriple);
    };

    return eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => removeElementFn(stack)(index))
                (_ => removeElementFn(stack)(churchNum(index)))
            ))
    (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
        (id) // return value
}

/**
 * Takes two stacks and concat it to one. E.g.:  concat( [1,2,3] )( [1,2,3] ) -> [1,2,3,1,2,3]
 *
 * @function
 * @haskell concat :: [a] -> [a] -> [a]
 * @param  {stack} s1
 * @return {function(s2:stack)} a concat stack
 * @example
 * const elements1          = convertArrayToStack( ["Hello", "Haskell"] );
 * const elements2          = convertArrayToStack( ["World", "Random"] );
 * const concatenatedStacks = concat( elements1 )( elements2 );
 *
 * jsNum( size( concatenatedStacks ) )          === 4
 * getElementByIndex( concatenatedStacks )( 0 ) === id
 * getElementByIndex( concatenatedStacks )( 1 ) === "Hello"
 * getElementByIndex( concatenatedStacks )( 2 ) === "Haskell"
 * getElementByIndex( concatenatedStacks )( 3 ) === "World"
 * getElementByIndex( concatenatedStacks )( 4 ) === "Random"
 */
const concat = s1 => s2 =>
    s1 === emptyStack
        ? s2
        : s2 === emptyStack
        ? s1
        : reduce(acc => curr => push(acc) (curr)) (s1) (s2);

/**
 * This function flatten a nested stack of stacks with values.
 * The function links them all together to form a stack. The depth level to which the structure is flattened is one.
 *
 * @function
 * @param  {stack} stack
 * @return {stack} a flatten stack
 * @example
 * const s1            = convertArrayToStack([1, 2]);
 * const s2            = convertArrayToStack([3, 4]);
 * const s3            = convertArrayToStack([5, 6]);
 * const stackOfStacks = convertArrayToStack([s1, s2, s3]);
 *
 * const flattenStack  = flatten( stackOfStacks );
 *
 * jsNum( size( flattenStack ) )          ===  6
 *
 * convertStackToArray(flattenStack)      === [1,2,3,4,5,6]
 *
 * getElementByIndex( flattenStack )( 0 ) === id
 * getElementByIndex( flattenStack )( 1 ) ===  1
 * getElementByIndex( flattenStack )( 2 ) ===  2
 * getElementByIndex( flattenStack )( 3 ) ===  3
 * getElementByIndex( flattenStack )( 4 ) ===  4
 * getElementByIndex( flattenStack )( 5 ) ===  5
 * getElementByIndex( flattenStack )( 6 ) ===  6
 */
const flatten = reduce( acc => curr => concat( acc )( curr ) )(emptyStack);

/**
 * The zipWith function receives a linking function and two stacks.
 * Using the linking function, the elements of the two transferred stacks are linked together to form a new stack.
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * @param  {function} f
 * @return {function(s1:stack): function(s2:stack): stack}
 * @example
 * const add = x => y => x + y;
 * const s1  = convertArrayToStack([1, 2, 3]);
 * const s2  = convertArrayToStack([4, 5, 6]);
 *
 * const zippedStack = zipWith(add)(s1)(s2);
 *
 * convertStackToArray( zippedStack )    === [5,7,9]
 *
 * jsNum( size( zippedStack ) )          ===  3
 *
 * getElementByIndex( zippedStack )( 0 ) === id
 * getElementByIndex( zippedStack )( 1 ) ===  5
 * getElementByIndex( zippedStack )( 2 ) ===  7
 * getElementByIndex( zippedStack )( 3 ) ===  9
 */
const zipWith = f => s1 => s2 => {

    const zipElements = t => {
        const s1  = t(firstOfTriple);
        const s2  = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)( f(element1)(element2) );

        return triple
        ( getPreStack(s1) )
        ( getPreStack(s2) )
        ( result          );
    }

    const iteration = t =>
        If( hasPre(t(firstOfTriple)) )
        (Then( zipElements(t) ))
        (Else(             t  ));

    const times = min(size(s1))(size(s2));

    return times
    (iteration)
    (triple
        ( reverseStack(s1) )
        ( reverseStack(s2) )
        ( emptyStack       )
    )
    (thirdOfTriple);
}

/**
 * Zip (combine) two Stack to one stack of pairs
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zip :: [a] -> [b] -> [(a, b)]
 * @type {function(triple): function(triple): triple}
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 *
 * const zippedStack = zip(s1)(s2);
 *
 * jsNum( size(zippedStack) )          === 2
 * getElementByIndex( zippedStack )(0) === id
 * getElementByIndex( zippedStack )(1) === pair(1)(3)
 * getElementByIndex( zippedStack )(2) === pair(2)(4)
 */
const zip = zipWith(pair);

/**
 * Check two stacks of equality.
 *
 * @function
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False (ChurchBoolean)
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = churchBool(element1 === element2);

        return triple
        ( getPreStack(s1) )
        ( getPreStack(s2) )
        ( result          );
    }

    const iteration = t =>
        LazyIf( and( hasPre( t(firstOfTriple)) )( t(thirdOfTriple)) )
        (Then(() => compareElements(t) ))
        (Else(() => t                  ));

    return LazyIf( eq(size1)(size2) )
    (Then(() => times
        (iteration)
        (triple
            ( reverseStack(s1) )
            ( reverseStack(s2) )
            ( True             )
        )
        (thirdOfTriple))
    )
    (Else(() => False));
};


/*
-----  ListMap
 */

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} listMap
 */

/**
 * index -> predecessor -> pair -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The listMap is a pure functional data structure and is therefore immutable.
 * The listMap is implemented as a stack aka triplet.
 * So the listMap have all the features and functionality that have the stack too.
 *
 * The first value of the listMap represents the size (number of elements) of the listMap.
 * At the same time the first value represents the index of the head (top value) of the listMap.
 * The second value represents the predecessor listMap
 * The third value represents the head ( top value ) of the listMap
 *
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} listMap as triple aka stack
 */
const listMap = triple;

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0)(id)( pair(id)(id) );

/**
 * A help function to create a new listMap
 */
const startListMap = f => f(emptyListMap);

/**
 * This function takes a map function (like JavaScript Array map) and a listMap. The function returns a new listMap with the "mapped" values.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const toUpperCase      = str => str.toUpperCase();
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans"});
 *
 * const mappedListMap    = mapListMap(toUpperCase)(listMapWithNames); // [ ("name1", "PETER"), ("name2", "HANS") ]
 *
 * getElementByKey( mappedListMap )( "name1" ) // "PETER"
 * getElementByKey( mappedListMap )( "name2" )  // "HANS"
 */
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

/**
 * This function takes a filter function (like JavaScript Array filter) and a listMap. The function returns the filtered listMap. If no elements match the filter, the empty listMap is returned.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans", name3: "Paul"});
 *
 * const filteredListMap  = filterListMap(str => str.startsWith('P'))(listMapWithNames); // [ ("name1", "Peter"), ("name3", "Paul") ]
 *
 * getElementByKey(filteredListMap)("name1");  // "Peter"
 * getElementByKey(filteredListMap)("name3");  // "Paul"
 */
const filterListMap = f => filter(p => f(p(snd)) );

/**
 * This function takes a reduce function first, a start value second and a ListMap as the last parameter. The function returns the reduced value.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const reduceFunc = acc => curr => acc + curr.income;
 * const employees = convertObjToListMap({ p1: {firstName: 'Peter',  income: 1000},
 *                                         p2: {firstName: 'Michael', income: 500} });
 *
 * reduceListMap(reduceFunc)(0)(employees); // 1500
 */
const reduceListMap = f => reduce(acc => curr => f(acc)(curr(snd)));

/**
 * Takes a JavaScript object and convert the key and values analog into a listMap
 *
 * @param  {object} obj
 * @return {listMap}
 * @example
 * const obj = {a: 'Hello', b: "Lambda"}
 *
 * const listMapEx = convertObjToListMap(obj);
 *
 * size(listMapEx)               // n2
 * getElementByIndex(result)(n1) // pair('a')("Hello"));
 * getElementByIndex(result)(n2) // pair('b')("Lambda"));
 */
const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);

/**
 * Get the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:Number): *} element (value) or id if key not exist
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * getElementByKey( testListMap )( 1 ) === "Hans"
 * getElementByKey( testListMap )( 2 ) === "Peter"
 * getElementByKey( testListMap )( 3 ) === 42
 */
const getElementByKey = listMap => key => {
    const times         = size(listMap); // TODO: successor of size
    const initArgsPair  = pair(listMap)(id); // TODO: set to undefined

    const getElement = argsPair => {
        const stack             = argsPair(fst);
        const predecessorStack  = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);

        return (currentKeyValPair(fst) === key)
            ? pair(predecessorStack)( currentKeyValPair(snd) )
            : pair(predecessorStack)( argsPair(snd)          );
    };

    return (times(getElement)(initArgsPair))(snd);
};

/**
 * Remove the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:*): *} element (value)
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * jsnum( size(testListMap) ) === 3
 *
 * const listMapOneRemoved = removeByKey(testListMap)(1)
 * jsnum( size(listMapOneRemoved) ) === 2
 */
const removeByKey = listMap => key => {
    const times         = size(listMap);
    const reversedStack = reverseStack(listMap);

    const removeByCon = currentStack => resultStack => key => {
        const currentKeyValPair = head(currentStack);
        const currentElement    = currentKeyValPair(snd);
        const currentKey        = currentKeyValPair(fst);
        const result            = key === currentKey
            ? resultStack
            : push( resultStack )( pair(currentKey)(currentElement) );

        return pair( getPreStack(currentStack) )( result );
    }

    const iteration = argsPair =>
        If( hasPre(argsPair(fst)) )
        (Then( removeByCon(argsPair(fst))(argsPair(snd))(key) ))
        (Else( argsPair ));


    return (times
        (iteration)
        (pair(reversedStack)(emptyListMap) )
    )(snd);
}

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject  = {firstName: "George", lastName: "Lucas"}
 *
 * const personListMap = convertListMapToArray(personObject); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * convertListMapToArray( personListMap ) // [ "George", "Lucas" ]
 */
const convertListMapToArray = listMap => reduceListMap(acc => curr => [...acc, curr])([])(listMap);

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject = {firstName: "George", lastName: "Lucas"}
 *
 * const result = convertObjToListMap( personObject ); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * getElementByKey( result )( "firstName" );  // "George"
 * getElementByKey( result )( "lastName"  );  // "Lucas"
 */
const convertListMapToStack = listMap => reduceListMap(acc => curr => push(acc)(curr))(emptyStack)(listMap);

/**
 * The logListMapToConsole function takes a ListMap and executes a site effect. The site effect logs the ListMap with its key and values to the console.
 *
 * @sideeffect
 * @function
 * @param {listMap} listMap
 */
const logListMapToConsole = listMap =>
    forEach(listMap)((element, index) => console.log(`Index ${index} (Key, Element): (${JSON.stringify(element(fst))}, ${JSON.stringify(element(snd))})` ));

/*
-----  Observable
 */

/**
 * Generic Types
 * @typedef {function} observable
 * @typedef {function} listener
 * @typedef {function} listMap
 * @typedef {function} observableBody
 */

/**
 * listeners -> value -> observableFunction -> observableFunction ;
 * observableBody is the Body-Observable-Construct for the observableFunctions.
 * observableFunctions are: {@link addListener}, {@link removeListener}, {@link removeListenerByKey}, {@link setValue}
 *
 * @haskell observableBody :: [a] -> b -> c -> c
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(obsFn:function): function(obsFn:function)} a Observable-Function
 */
const observableBody = listeners => value => obsFn =>
    obsFn(listeners)(value)

/**
 * initialValue -> observableBody ;
 * Observable - create new Observable incl. the initial-value
 *
 * @haskell Observable :: a -> Observable
 * @function
 * @param  {number|churchNumber|string} initialValue
 * @return {observableBody} - a Observable with an emptyListMap & the InitialValue
 * @example
 * const obsExample = Observable(0)
 *                          (addListener)( listenerLogToConsole      )
 *                          (addListener)( listenerNewValueToElement )
 */
const Observable = initialValue =>
    observableBody(emptyListMap)(initialValue)(setValue)(initialValue);

/**
 * listeners -> oldValue -> newValue -> Observable ;
 * set the new value and notify all listeners
 *
 * @extends observableBody
 * @haskell setValue :: [a] -> b -> b -> Observable
 * @function
 * @param  {listMap} listeners
 * @return {function(oldValue:*): function(newValue:*): observableBody} {@link observableBody}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue));
    return observableBody(listeners)(newValue);
}

/**
 * listeners -> value -> value ;
 * get the value of Observable
 *
 * @extends observableBody
 * @haskell getValue :: [a] -> b -> b
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(value:*)}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 *
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const getValue = listeners => value => value;

/**
 * listeners -> value -> newListener -> Observable ;
 * Add a new listener to the observable and the current observable value is immediately sendet to the listener.
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): observableBody} {@link observableBody}
 * @example
 * const obsExample = Observable(0)
 *                          (addListener)( listenerLogToConsole      )
 *                          (addListener)( listenerNewValueToElement )
 */
const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return observableBody(push(listeners)(newListener))(value);
}

/**
 * listeners -> value -> listenerKey ;
 * Remove a Listener by his key
 *
 * @extends observableBody
 * @haskell removeListenerByKey :: [a] -> b -> c
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)} {@link observableBody}
 * @example
 * let observedObject = {};
 * const listenerValue = newListenerWithCustomKey( 42 )( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 * obsExample = obsExample(setValue)(11)
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListenerByKey)(42) // 'listenerValue' is removed as listener
 *
 * obsExample = obsExample(setValue)(66)
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListenerByKey = listeners => value => listenerKey =>
    observableBody(removeByKey(listeners)(listenerKey))(value);

/**
 * listeners -> value -> givenListener ;
 * Remove a Listener by Listener
 *
 * @extends observableBody
 * @haskell removeListenerByKey :: [a] -> b -> c
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(givenListener:listener)} {@link observableBody}
 * @example
 * let observedObject = {};
 * const listenerValue = newListener( listenerNewValueToElement (observedObject) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 *
 * obsExample = obsExample(setValue)(11)
 *
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListener)(listenerValue)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListener = listeners => value => givenListener =>
    observableBody(removeByKey(listeners)(givenListener(fst)))(value);

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. (Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {*} key
 * @return {function(listenerFn:function) : listener} new listener with custom key for the observable
 * @example
 * const listenerLog = newListenerWithCustomKey(42)(listenerLogToConsole);
 */
const newListenerWithCustomKey = key => listenerFn => pair(key)(listenerFn);

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. The 'generateRandomKey' generate String with the length of six with random Letters (up-/lowercase) & Numbers.
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {function} listenerFn
 * @return {listener} new listener with generated key for the observable
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

/**
 * Set a new Key for the listener.
 *
 * @function
 * @param  {*} newKey
 * @return {function(listener:function) : listener} listener with the key
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const setListenerKey = newKey => listener => pair(newKey)(listener(snd));

/**
 * Get the key of a listener
 *
 * @function
 * @param  {listener} listener
 * @return {*} key
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const getListenerKey = listener => listener(fst);

/**
 * The logListenersToConsole function is passed as a parameter of an observable and performs a side effect.
 * The site effect logs all listeners of the observable with their keys and values on the console. * @sideeffect
 *
 * @extends observableBody
 * @function
 */
const logListenersToConsole = listeners => _ =>
    forEach(listeners)((element, index) => console.log( 'element at: ' + index + ': ' + showPair(typeof (element) === 'object' ? JSON.stringify(element) : element) ));

/*
    Listener-Functions
 */
const listenerLogToConsole                        =            nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`);
const listenerNewValueToElement                   = element => nVal => oVal => element.value = nVal;
const listenerNewValueToDomElementTextContent     = element => nVal => oVal => element.textContent = nVal;
const listenerOldValueToDomElementTextContent     = element => nVal => oVal => element.textContent = oVal;
const listenerNewValueLengthToElementTextContent  = element => nVal => oVal => element.textContent = nVal.length;


/*
-----  Maybe / Either
 */

/*
    EITHER-Type
    Left and Right are two functions that accept one value and two functions respectively.
    Both functions ignore one of the two passed functions.
    The Left function applies the left (first passed) function to the parameter x and ignores the second function.
    The Right function applies the right (second passed) function to the parameter x and ignores the first function.
    Left and Right form the basis for another type, the Maybe Type.
 */
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

/*
    MAYBE-Type
    The Maybe Type builds on the Either Type and comes from the world of functional programming languages.
    The Maybe Type is a polymorphic type that can also (like the Either Type) assume two states.
    The states are: there is a value, which is expressed with Just(value), or there is no value, which is expressed with Nothing.
 */
const Nothing  = Left();
const Just     = Right ;

/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
    (() => defaultVal)
    (id);

/**
 * The function maybeDivision "maybe" performs a division with 2 passed parameters.
 * If the passed numbers are of type integer and the divisor is not 0, the division is performed and Just is returned with the result.
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

/**
 * The eitherTruthy function expects a value and checks whether it is truthy.
 * In case of success, a Right with the element is returned and in case of error a Left with the corresponding error message.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = value =>
    eitherTruthy(value)
    (_ => Nothing)
    (_ => Just(value));

/**
 * The eitherNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * The maybeNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNotNullAndUndefined = value =>
    eitherNotNullAndUndefined(value)
    (_ => Nothing)
    (_ => Just(value));

/**
 * The eitherElementOrCustomErrorMessage function expects an error message and an element.
 * The function checks the element for null or undefined and returns either a Right with the value or a Left with the error message passed.
 *
 * @param  {string} errorMessage
 * @return {function(element:*): Left|Right} either Right with the given Element or Left with the custom ErrorMessage
 */
const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherNotNullAndUndefined(element)
    (_ => Left(errorMessage))
    (_ => Right(element));

/**
 * The eitherDomElement function takes a Dom element id and returns an Either Type.
 * If successful, the HTML element is returned, otherwise an error message that such an element does not exist.
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage
    (`no element exist with id: ${elemId}`)
    (document.getElementById(elemId));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, a Just with this HTMLElement is returned, otherwise Nothing.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeDomElement = elemId =>
    eitherDomElement(elemId)
    (_ => Nothing)
    (e => Just(e));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, the HTMLElement is returned, otherwise undefined.
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElement(elemId)
    (console.error)
    (id);

/**
 * This function takes many DOM element ID as array of string.
 * If elements with those ID exists in the DOM, the HTMLElements ares returned, otherwise undefined
 *
 * @param  {string} elemIds
 * @return {HTMLElement|undefined[]} a array with HTMLElements when exist, else undefined
 */
const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

/**
 * This function takes a value and checks whether it is of the type Integer.
 * If it is not a value of the type Integer, a Nothing is returned.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNumber = value =>
    eitherNumber(value)
    (_ => Nothing)
    (_ => Just(value));

/**
 * The eitherNumber function checks whether a value is of the integer type.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with number or Left with Error
 */
const eitherNumber = value =>
    Number.isInteger(value)
        ? Right(value)
        : Left(`'${value}' is not a integer`);

/**
 * The eitherNaturalNumber function checks whether the value passed is a natural JavaScript number.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with positiv number or Left with Error
 */
const eitherNaturalNumber = value =>
    Number.isInteger(value) && value >= 0
        ? Right(value)
        : Left(`'${value}' is not a natural number`);

/**
 * The eitherFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherFunction = value =>
    typeof value === "function"
        ? Right(value)
        : Left(`'${value}' is not a function`);

/**
 * The maybeFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeFunction = value =>
    eitherFunction(value)
    (_ => Nothing)
    (_ => Just(value))

/**
 * The eitherTryCatch function takes a function f that could go wrong.
 * This function is executed in a try-catch block.
 * If an error occurs during the execution of the function, it is caught and a left is returned with the error message, otherwise a right with the result.
 *
 * @param  {function} f
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

/**
 * The function eitherElementsOrErrorsByFunction takes a function as the first parameter and a rest parameter (JavaScript Rest Parameter) as the second parameter.
 * The function that is passed should take a value and return an Either Type. The function eitherElementsOrErrorsByFunction then applies the passed function to any value passed by the Rest parameter.
 * An Either is returned: In case of success (Right) the user gets a ListMap with all "success" values. In case of an error, the user gets a stack with all error messages that occurred.
 *
 * @haskell eitherElementsOrErrorsByFunction:: (a -> Either a) -> [a] -> Either [a]
 * @param  {function} eitherProducerFn
 * @return {function(elements:...[*]): {(Left|Right)}} either Right with all "success" values as ListMap or Left with all error messages that occurred as Stack
 */
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
    reduce(acc => curr =>
        acc
        ( stack => Left( eitherProducerFn(curr)
            (err => push(stack)(err) )
            (_   => stack            )
            )
        )
        ( listMap => eitherProducerFn(curr)
            (err => Left(  push( emptyStack )( err             )))
            (val => Right( push( listMap    )( pair(curr)(val) )))
        )
    )
    ( Right( emptyListMap) )
    ( convertArrayToStack(elements) );

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
    (acc => curr =>
        flatMapMaybe(acc)(listMap =>
            mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
        )
    )
    ( Just(emptyListMap) )
    ( convertArrayToStack(elements) );

/**
 * The mapMaybe function is used to map a Maybe Type. The function takes a Maybe and a mapping function f.
 * The function returns the mapped Maybe.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing)
 * @example
 * mapMaybe( Just(10) ) (x => x * 4) // Just (40)
 * mapMaybe( Nothing )  (x => x * 4) // Nothing
 */
const mapMaybe  = maybe => f => maybe (() => maybe) (x => Just(f(x)));  // maybe.map

/**
 * The function flatMapMaybe is used to map a maybe type and then flatten the result.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing=
 * @example
 * flatMapMaybe( Just(10) )(num => Just(num * 2));    // Just (20)
 * flatMapMaybe( Just(10) )(num => Nothing      );    // Nothing
 * flatMapMaybe( Nothing  )(num => Just(num * 2));    // Nothing
 */
const flatMapMaybe = maybe => f => maybe (() => maybe) (x =>       f(x));  // maybe.flatmap


/*
-----  Box
 */

/**
 * Generic Types
 * @typedef {function} box
 */

/**
 * The fmap function is used to process (map) the contents of a box.
 * These fmap function calls can be used any number of times in succession (chainning of functions).
 *
 * @summary Box.map
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * Box(5)                                 // { 5 }
 *  (fmap)(n => n * 10)                   // { 50 }
 *  (fmap)(n => n + 15)                   // { 65 }
 *  (fmap)(n => String.fromCharCode(n));  // { 'A' }
 */
const fmap = x => f => g => g(f(x));

/**
 * The Box function is used to pack any value into a "box".
 *
 * @summary Box.of
 * @function
 * @param  {*} x
 * @return {*}
 * @example
 * Box(10);                 // { 10 }
 * Box("Hello World");      // { "Hello World" }
 * Box(p);                  // { p }
 */
const Box = x => fmap(x)(id);

/**
 * The fold function is used to map a value in the "box" and then extract it (unpack the contents from the box).
 *
 * @summary map and then get content out of the box
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * Box(5)                                 // { 5 }
 *  (fmap)(n => n * 10)                   // { 50 }
 *  (fmap)(n => n + 15)                   // { 65 }
 *  (fold)(n => String.fromCharCode(n));  // 'A'
 */
const fold  = x => f => f(x);

/**
 * The chain function is used to perform a flatMap. If a map function creates a box, fmap would create a box within a box.
 * To remove this extra box or to flatten the mapped result there is the method chain.
 * This allows nested box calls to take place.
 *
 * @summary Box.flatMap
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * Box(5)                                     // { 5 }
 *  (fmap)(num => num + 5)                    // { 10 }
 *  (chain)(num => Box(num * 2)
 *                  (fmap)(num => num + 1))   // { 21 }
 *  (chain)(num => Box(num * 3)
 *                  (fmap)(num => num + 1))   // { 64 }
 */
const chain = x => f => g => g((f(x)(id)));

/**
 * The app function is used to apply a boxed function (function in a box) to a boxed value.
 * This "design pattern" or app function together with the box function form an applicative.
 *
 * @summary Box.applicative
 * @function applicative
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * Box(x => x + 5)          // { 10 + 5 }
 *  (app)( Box(10) );       // { 10 }
 *
 * Box( x => y => x + y)    // { 10 + 24 }
 *  (app)( Box(10) )        // { 10 }
 *  (app)( Box(14) );       // { 24 }
 */
const app = x => f => g => g(f(fmap)(x)(id));

/**
 * The liftA2 function is used to apply a function to 2 wrapped values.
 *
 * @function
 * @param  {function} f
 * @return {function(fx:function): function(fy:function): *}
 * @example
 * liftA2(name1 => name2 => name1 + " " + name2)     // { "Tyrion Lannister" }
 *  ( Box("Tyrion"   ) )
 *  ( Box("Lannister") );
 */
const liftA2 = f => fx => fy =>
    fx(fmap)(f)(app)(fy)

/**
 * getContent is used to unpack the content out of a "box".
 *
 * @summary get Content out of the box (unwrap)
 * @function unwrap
 * @param  {box} b
 * @return {*} value in Box
 * @example
 * getContent( Box(10)      )      //  10
 * getContent( Box("Hello") )      //  "Hello"
 * getContent( Box(p)       )      //  p
 */
const getContent = b => b(id);

/**
 * The debug function is a helper function that is there for debug purposes.
 * The function helps the user to examine the individual intermediate results in a pipeline.
 *
 * @sideffect logs to console
 * @function unwrap
 * @param  {*} x
 * @return {*} x
 * @example
 * Box(10)
 *  (fmap)(debug)        // Ausgabe auf der Konsole: 10
 *  (fmap)(n => n + 2)
 *  (fold)(debug);       // Ausgabe auf der Konsole: 12
 */
const debug = x => {
    console.log(x);
    return x;
}

/**
 * Using the box with the Maybe Type
 *
 * To use the box construction with maybe values, there is a special function that facilitates the processing of maybe types.
 * This simplifies the processing with the maybe type and the maybe types can be linked.
 */

/**
 * The function fmapMaybe corresponds to the function {@link fmap} for a Maybe Type
 *
 * @summary  map (returns a box) --> for chaining
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * const maybePerson = () => Just({firstName: "Tyrion", lastName: "Lannister"});
 *
 * Box(maybePerson())                                 // { Just( {firstName: "Tyrion", lastName: "Lannister"} ) }
 *  (fmapMaybe)(p => p.firstName)                     // { Just( "Tyrion" ) }
 *  (fmapMaybe)(firstName => firstName.toUpperCase()) // { Just( "TYRION" ) }
 */
const fmapMaybe = x => f => g => g(mapMaybe(x)(f));

/**
 * The function foldMaybe corresponds to the function {@link fold} for a Maybe Type.
 *
 * @summary map and then get Content out of the box
 * @function
 * @return mapMaybe
 * @example
 * Box( Just(10) )                   // { Just(10) }
 *  (fmapMaybe)(x => x + 10)         // { Just(20) }
 *  (foldMaybe)(num => num + '$')    // Just("20$")
 */
const foldMaybe = mapMaybe;

/**
 * The chainMaybe function corresponds to the {@link chain} function for a Maybe Type.
 *
 * @summary map ant then flatten (returns a box) --> for chaining
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * const maybePerson = () => Just( {firstName: "Tyrion", lastName: "Lannister"} );
 *
 * const maybeFirstName = obj =>
 *      obj && obj.hasOwnProperty('firstName')
 *          ? Just(obj.firstName)
 *          : Nothing;
 *
 * Box( maybePerson() )                                  // { Just({firstName: "Tyrion", lastName: "Lannister"}) }
 *  (chainMaybe)( maybeFirstName )                       // { Just("Tyrion") }
 *  (foldMaybe)( firstName => firstName.toUpperCase() )  //   Just("TYRION")
 */
const chainMaybe = x => f => g => g(flatMapMaybe(x)(f));

/**
 * The appMaybe function corresponds to the {@link app} function for a Maybe Type.
 *
 * @function
 * @param  {*} x
 * @return {function(f:function): function(g:function): *}
 * @example
 * Box( Just(x => x + 5) )          // { Just(15 + 5) }
 *  (appMaybe)( Just(10) );         // { Just(10) }
 */
const appMaybe = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

/**
 * The appMaybe function corresponds to the {@link liftA2} function for a Maybe Type.
 * If one parameter (fx, fy or both) is Nothing, the total result of the function is Nothing.
 *
 * @function
 * @param  {function} f
 * @return {function(fx:function): function(fy:function): *}
 * @example
 * liftA2Maybe( x => y => x + y)  // (10 + 5)
 *  ( Just(10) )
 *  ( Just(5)  );
 */
const liftA2Maybe = f => fx => fy =>
    Box(fx)
    (fmapMaybe)(f)
    (appMaybe)(fy);


const pureMaybe = f => Just(f);

/*
-----  HTTP
 */

/**
 * HttpGet function can be used to request asynchronous data from a web server.
 * The request being automatically terminated after 30 seconds.
 *
 * @param  {string} url
 * @return {function(callback:function): void}
 * @example
 * HttpGet(jokeUrl)
 * (response => getDomElement("jokeText").textContent = JSON.parse(response).value)
 */
const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState > 1 && xmlHttp.readyState < 4)
            ? (xmlHttp.status < 200 || xmlHttp.status >= 300)                            ? xmlHttp.abort()                : () => console.log("not readystate: " + xmlHttp.readyState)
            : (xmlHttp.readyState === 4 && xmlHttp.status >= 200 && xmlHttp.status <300) ? callback(xmlHttp.responseText) : () => console.error("error fetch data")

    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30 * 1000;                     //30 seconds
    xmlHttp.ontimeout = () => console.error("timeout after 30 seconds");
    xmlHttp.send();
}

/**
 * HttpGet function can be used to request synchronous data from a web server.
 *
 * @param  {string} url
 * @return {void}
 * @example
 * Box( HttpGet(jokeUrl) )
 *  (mapf)( JSON.parse )
 *  (fold)( x => getDomElement("joke").textContent = x.value) );
 */
const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( );
    return xmlHttp.responseText;
}
