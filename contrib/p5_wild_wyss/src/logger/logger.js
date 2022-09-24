export {Logger}
import {LazyIf, Then, Else, True, False } from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";

/**
 * The Logger function yields a custom configured log function.
 *
 * @param {function} callback caused by a logger call
 * @param {String} msg the processed msg
 * @param {boolean} state the logger's on/off state
 * @return { function(x:String): function(y:boolean): {f: { y x }} }
 * @example
 * const log = Logger(msg => console.log(msg));
 * log("action")(true);
 */
const Logger = callback => msg => state =>
  LazyIf( convertToChurchBool(state) )
    (Then( () => execute(callback)(msg)  ))
    (Else( () => False                   ));

const convertToChurchBool = state => state ? True : False;

const execute = callback => msg => {
  callback(msg);
  return True;
};