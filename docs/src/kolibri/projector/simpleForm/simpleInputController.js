import {SimpleInputModel}                from "./simpleInputModel.js";
import {LABEL, NAME, TYPE, VALID, VALUE} from "../../presentationModel.js";

export { SimpleInputController }

/**
 * @typedef { object } SimpleInputControllerType
 * @template T
 * @property { ()  => T }           getValue
 * @property { (T) => void }        setValue
 * @property { ()  => String}       getType
 * @property { (Boolean) => void }  setValid
 * @property { (onValueChangeCallback) => void } onLabelChanged
 * @property { (onValueChangeCallback) => void } onValidChanged
 * @property { (onValueChangeCallback) => void } onValueChanged
 * @property { (onValueChangeCallback) => void } onNameChanged
 */

/**
 * The SimpleInputController gives access to a {@link SimpleInputModel} but in a limited fashion.
 * It does not expose the underlying {@link Attribute} but only those functions that a user of this
 * controller needs to see.
 * While controllers might contain business logic, this basic controller does not contain any.
 * @constructor
 * @template T
 * @param  { InputAttributes } args
 * @return { SimpleInputControllerType }
 * @example
 *     const controller = SimpleInputController({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputController = args => {
    const singleAttr = SimpleInputModel(args);
    return {
        setValue:       singleAttr.setConvertedValue,
        getValue:       singleAttr.getObs(VALUE).getValue,
        setValid:       singleAttr.getObs(VALID).setValue,
        getType:        singleAttr.getObs(TYPE) .getValue,
        onValueChanged: singleAttr.getObs(VALUE).onChange,
        onValidChanged: singleAttr.getObs(VALID).onChange,
        onLabelChanged: singleAttr.getObs(LABEL).onChange,
        onNameChanged:  singleAttr.getObs(NAME) .onChange,
    };
}
