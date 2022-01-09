/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }   from "../../kolibri/observable.js";
import { EDITABLE, VALUE }              from "../../kolibri/presentationModel.js"
import { reset, Person }                from "./person.js"

export { ListController, SelectionController }

const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};

/**
 * Representing a selection when no person is selected.
 */
const noSelection = reset(Person());
noSelection.firstname.setQualifier("Person.none.firstname");
noSelection.lastname .setQualifier("Person.none.lastname");
noSelection.detailed .setQualifier("Person.none.detailed");
noSelection.firstname.getObs(EDITABLE).setValue(false); // the non-selection is not editable
noSelection.lastname .getObs(EDITABLE).setValue(false);
noSelection.detailed .getObs(VALUE).setValue(false);

const SelectionController = model => {

    const selectedModelObs = Observable(model);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected  : selectedModelObs.onChange,
        clearSelection   : () => selectedModelObs.setValue(noSelection),
    }
};
