
import { SimpleInputController } from "./simpleInputController.js";

export { SimpleFormController }

/**
 * @typedef { Array<SimpleInputControllerType> } SimpleFormControllerType
 */

/**
 * The SimpleFormController creates as many instances of {@link SimpleInputController} as needed for
 * the inputs that are specified in the inputAttributesArray.
 * Note that controllers are compositional by means of function (ctor) composition.
 * @constructor
 * @param  { Array<InputAttributes> } inputAttributesArray - Specification of the form to create and bind.
 * @return { SimpleFormControllerType }
 * @example
 *     const controller = SimpleFormController([
           { value: "Dierk", type: "text"   },
           { value: 0,       type: "number" },
       ]);
 */
const SimpleFormController = inputAttributesArray => {
    // noinspection UnnecessaryLocalVariableJS
    const inputControllers = inputAttributesArray.map(SimpleInputController);
    // set up any business rules (we do not have any, yet)
    return inputControllers ;
};
