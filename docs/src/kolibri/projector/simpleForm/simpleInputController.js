import {SimpleInputModel}                                   from "./simpleInputModel.js";
import {EDITABLE, LABEL, NAME, TOOLTIP, TYPE, VALID, VALUE} from "../../presentationModel.js";

export { SimpleInputController, SimpleAttributeInputController }

/**
 * @typedef  SimpleInputControllerType
 * @template _T_
 * @property { ()       => _T_ }                            getValue
 * @property { (_T_)    => void }                           setValue
 * @property { ()       => String }                         getLabel
 * @property { (String) => void }                           setLabel
 * @property { ()       => String }                         getTooltip
 * @property { (String) => void }                           setTooltip
 * @property { ()       => String}                          getType
 * @property { (valid: !Boolean) => void }                  setValid
 * @property { (converter: Converter<_T_>)        => void } setConverter
 * @property { (cb: ValueChangeCallback<String>)  => void } onLabelChanged
 * @property { (cb: ValueChangeCallback<String>)  => void } onTooltipChanged
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onValidChanged
 * @property { (cb: ValueChangeCallback<_T_>)     => void } onValueChanged
 * @property { (cb: ValueChangeCallback<String>)  => void } onNameChanged
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onEditableChanged
 */

/**
 * The SimpleInputController gives access to a {@link SimpleInputModel} but in a limited fashion.
 * It does not expose the underlying {@link Attribute} but only those functions that a user of this
 * controller needs to see.
 * While controllers might contain business logic, this basic controller does not contain any.
 * @constructor
 * @template _T_
 * @param  { InputAttributes } args
 * @return { SimpleInputControllerType<_T_> }
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
    getValue:          attribute.getObs(VALUE)  .getValue,
    setValue:          attribute.setConvertedValue,
    setValid:          attribute.getObs(VALID)  .setValue,
    getLabel:          attribute.getObs(LABEL)  .getValue,
    setLabel:          attribute.getObs(LABEL)  .setValue,
    getName:           attribute.getObs(NAME)   .getValue,
    setName:           attribute.getObs(NAME)   .setValue,
    getTooltip:        attribute.getObs(TOOLTIP).getValue,
    setTooltip:        attribute.getObs(TOOLTIP).setValue,
    getType:           attribute.getObs(TYPE)   .getValue,
    onValueChanged:    attribute.getObs(VALUE)  .onChange,
    onValidChanged:    attribute.getObs(VALID)  .onChange,
    onLabelChanged:    attribute.getObs(LABEL)  .onChange,
    onNameChanged:     attribute.getObs(NAME)   .onChange,
    onTooltipChanged:  attribute.getObs(TOOLTIP).onChange,
    onEditableChanged: attribute.getObs(EDITABLE).onChange,
    setConverter:      attribute.setConverter,
} );
