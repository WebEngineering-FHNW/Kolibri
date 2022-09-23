export {Logger, enableLogger, disableLogger}
import {LazyIf, Then, Else, True, False } from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";

const Logger = loggingFunction => callback => msg =>
  LazyIf( loggerOn )
    (Then( () => execute(loggingFunction)(callback)(msg)  ))
    (Else( () => False                                    ));

const execute = loggingFunction => callback => msg => {
  loggingFunction(msg);
  callback(msg);
  return True;
}

let loggerOn = True;
const disableLogger = () => loggerOn = False;
const enableLogger  = () => loggerOn = True;
