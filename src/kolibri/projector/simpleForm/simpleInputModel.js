import {Attribute, EDITABLE, LABEL, NAME, TYPE, VALID } from "../../presentationModel.js";
import {TEXT}                                           from "../../util/dom.js";

export { SimpleInputModel }


/**
 * @typedef { object } InputAttributes
 * @template _T_
 * @property { !_T_ } value      - mandatory value, will become the input value, defaults to undefined
 * @property { ?String } label - optional label, defaults to undefined
 * @property { ?String } name  - optional name that reflects the name attribute of an input element, used in forms
 * @property { ?InputTypeString } type - optional type, allowed values are
 *              the values of the HTML Input element's "type" attribute. Defaults to "text".
 */

/**
 * Create a presentation model for the purpose of being used to bind against a single HTML Input in
 * combinations with its pairing Label element.
 * For a single input, it only needs one attribute.
 * @constructor
 * @template _T_
 * @param  { InputAttributes<_T_> }
 * @return { AttributeType<_T_> }
 * @example
 *     const model = SimpleInputModel({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputModel = ({value, label, name, type= TEXT}) => {
    const singleAttr = Attribute(value);
    singleAttr.getObs(TYPE)    .setValue(type);
    singleAttr.getObs(EDITABLE).setValue(true);
    singleAttr.getObs(VALID)   .setValue(true);
    if (null != label) singleAttr.getObs(LABEL).setValue(label);
    if (null != name ) singleAttr.getObs(NAME) .setValue(name);

    return /** AttributeType<_T_> */ singleAttr;
};
