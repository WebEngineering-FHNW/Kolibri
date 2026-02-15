import {id} from "../lambda-calculus-library/lambda-calculus.js";
import {flatMapMaybe, Just, mapMaybe} from "../maybe/maybe.js";
export {Box, fmap, fold, chain, debug, fmapMaybe, foldMaybe, chainMaybe, getContent, app, liftA2, appMaybe, liftA2Maybe, pureMaybe}

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




