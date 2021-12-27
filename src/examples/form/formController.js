import { Attribute, VALUE, VALID, LABEL, NAME, TYPE } from "../../kolibri/presentationModel.js";
export { SimpleInputController, FormController }

const SimpleInputModel = ({value, label, name, type="text"}) => {
    const textAttr = Attribute(value);
    textAttr.getObs(LABEL).setValue(label);
    textAttr.getObs(NAME) .setValue(name);
    textAttr.getObs(TYPE) .setValue(type);

    // set up any default values, converters, and validators
    return { textAttr };
}

const SimpleInputController = args => {
    const { textAttr } = SimpleInputModel(args);
    return {
        setText:            textAttr.setConvertedValue,
        // getText : textAttr.getObs(VALUE).getValue,
        onTextChanged:      textAttr.getObs(VALUE).onChange,
        onTextValidChanged: textAttr.getObs(VALID).onChange,
        onTextLabelChanged: textAttr.getObs(LABEL).onChange,
        onTextNameChanged:  textAttr.getObs(NAME) .onChange,
        onTextTypeChanged:  textAttr.getObs(TYPE) .onChange,
    };
}

const FormController = args => {
    const inputControllers = args.map(SimpleInputController);
    // set up any business rules
    return {
        inputControllers
    };
}
