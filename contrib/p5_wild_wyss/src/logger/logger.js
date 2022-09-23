export {Logger, enableLogger, disableLogger}
import {LazyIf, Then, Else, True, False } from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";

const Logger = callback => msg =>
  LazyIf( loggerOn )
    (Then( () => execute(callback)(msg)  ))
    (Else( () => False                   ));

const execute = callback => msg => {
  callback(msg);
  return True;
};

let loggerOn = False;
const disableLogger = () => loggerOn = False;
const enableLogger  = () => loggerOn = True;
