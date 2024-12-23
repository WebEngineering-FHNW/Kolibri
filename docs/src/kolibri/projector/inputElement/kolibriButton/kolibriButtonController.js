import {KolibriButtonModel} from "./kolibriButtonModel.js";
import {VALUE, TYPE, DESIGNSYSTEM, EMPHASIS, STATE} from "../../../presentationModel.js";

export {KolibriButtonController, KolibriAttributeButtonController}

const KolibriButtonController = args => KolibriAttributeButtonController(KolibriButtonModel(args));


const KolibriAttributeButtonController = attribute => {
    return {
        setValue:               attribute.setConvertedValue,
        getValue:               attribute.getObs(VALUE)         .getValue,
        setType:                attribute.getObs(TYPE)          .setValue,
        getType:                attribute.getObs(TYPE)          .getValue,
        setDesignSystem:        attribute.getObs(DESIGNSYSTEM)  .setValue,
        getDesignSystem:        attribute.getObs(DESIGNSYSTEM)  .getValue,
        setEmphasis:            attribute.getObs(EMPHASIS)      .setValue,
        getEmphasis:            attribute.getObs(EMPHASIS)      .getValue,
        setState:               attribute.getObs(STATE)         .setValue,
        getState:               attribute.getObs(STATE)         .getValue,

        onValueChanged:         attribute.getObs(VALUE)        .onChange,
        onValidChanged:         attribute.getObs(TYPE)         .onChange,
        onDesignSystemChanged:  attribute.getObs(DESIGNSYSTEM) .onChange,
        onEmphasisChanged:      attribute.getObs(EMPHASIS)     .onChange,
        onStateChanged:         attribute.getObs(STATE)        .onChange,
    }
};
