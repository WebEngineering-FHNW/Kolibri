export {Logger}
import {LazyIf, Then, Else, True, False } from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";

/**
 * The Logger function yields a custom configured log function.
 *
 * @param {() => boolean} activated - returns true, if logging is activated. false otherwise
 * @param {() => void} callback - caused by a logger call
 * @param {String} msg - the processed msg
 * @return { function(x:String): function(y:boolean): {f: { y x }} }
 * @example
 * let loggingEnabled = true;
 * const activated = () => loggingEnabled;
 * const log = Logger(activated)(msg => console.log(msg));
 * log("action");
 */
const Logger = activated => callback => msg =>
  LazyIf( convertToChurchBool(activated()) )
    (Then( () => callback(msg)  ))
    (Else( () => False          ));

/**
 * Converts a js boolean to a church boolean
 *
 * @param state the boolean to convert
 * @returns {churchBoolean}
 */
const convertToChurchBool = state => state ? True : False;