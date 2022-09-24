export {Logger}
import {LazyIf, Then, Else, True, False } from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";

const Logger = callback => msg => state =>
  LazyIf( convertToChurchBool(state) )
    (Then( () => execute(callback)(msg)  ))
    (Else( () => False                   ));

const convertToChurchBool = state => state ? True : False;

const execute = callback => msg => {
  callback(msg);
  return True;
};