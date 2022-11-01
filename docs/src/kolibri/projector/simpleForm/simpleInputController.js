import {SimpleInputModel}                          from "./simpleInputModel.js";
import {EDITABLE, LABEL, NAME, TYPE, VALID, VALUE} from "../../presentationModel.js";

export { SimpleInputController, SimpleAttributeInputController }

/**
 * @typedef { object } SimpleInputControllerType<T>
 * @template T
 * @property { ()  => T }                   getValue
 * @property { (T) => void }                setValue
 * @property { ()  => String}               getType
 * @property { (valid: !Boolean) => void }  setValid
 * @property { (converter: Converter<T>)                  => void } setConverter
 * @property { (callback: onValueChangeCallback<String>)  => void } onLabelChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onValidChanged
 * @property { (callback: onValueChangeCallback<T>)       => void } onValueChanged
 * @property { (callback: onValueChangeCallback<String>)  => void } onNameChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onEditableChanged
 */

/**
 * The SimpleInputController gives access to a {@link SimpleInputModel} but in a limited fashion.
 * It does not expose the underlying {@link Attribute} but only those functions that a user of this
 * controller needs to see.
 * While controllers might contain business logic, this basic controller does not contain any.
 * @constructor
 * @template T
 * @param  { InputAttributes } args
 * @return { SimpleInputControllerType<T> }
 * @example
 *     const controller = SimpleInputController({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputController = args => SimpleAttributeInputController(SimpleInputModel(args));

const SimpleAttributeInputController = attribute => ( {
    setValue:          attribute.setConvertedValue,
    getValue:          attribute.getObs(VALUE).getValue,
    setValid:          attribute.getObs(VALID).setValue,
    getType:           attribute.getObs(TYPE).getValue,
    onValueChanged:    attribute.getObs(VALUE).onChange,
    onValidChanged:    attribute.getObs(VALID).onChange,
    onLabelChanged:    attribute.getObs(LABEL).onChange,
    onNameChanged:     attribute.getObs(NAME).onChange,
    onEditableChanged: attribute.getObs(EDITABLE).onChange,
    setConverter:      attribute.setConverter,
} );
