export {True, False, id, lazy, toChurchBoolean, convertToJsBool}

const id = x => x;
const lazy = x => () => x;
const toChurchBoolean = value => value ? True : False;
const convertToJsBool = b => b(true)(false);
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
