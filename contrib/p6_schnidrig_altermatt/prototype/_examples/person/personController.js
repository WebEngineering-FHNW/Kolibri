/**
 * @module personController as shallow wrappers around observables.
 * For the moment, this might seem over-engineered - and it is.
 * We do it anyway to follow the canonical structure of classical MVC where
 * views only ever know the controller API, not the model directly.
 */
import { ObservableList, Observable }   from "../../kolibri/observable.js";
import { EDITABLE, VALUE }              from "../../kolibri/presentationModel.js"
import { Person, reset }                from "./person.js"

export { ListController, SelectionController }

/**
 * @typedef ListControllerType<T>
 * @template T
 * @property { (observableListCallback) => void } onModelAdd
 * @property { (observableListCallback) => void } onModelRemove
 * @property { (model:T) => void }                removeModel
 * @property { ()  => void }                      addModel - add a newly created model
 */

/**
 * ListController maintains an observable list of arbitrary models.
 * In order to construct models, it takes a modelConstructor as parameter.
 * @template T
 * @param  { () => T } modelConstructor - a constructor for models that are to be maintained here.
 * @return { ListControllerType<T> }
 * @constructor
 */
const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel        : () => listModel.add(modelConstructor()),
        removeModel     : listModel.del,
        onModelAdd      : listModel.onAdd,
        onModelRemove   : listModel.onDel,
    }
};

/**
 * Representing a selection when no person is selected.
 * Null-Object Pattern.
 * @private
 */
const noSelection = reset(Person());
noSelection.firstname.setQualifier("Person.none.firstname");
noSelection.lastname .setQualifier("Person.none.lastname");
noSelection.detailed .setQualifier("Person.none.detailed");
noSelection.firstname.getObs(EDITABLE).setValue(false); // the non-selection is not editable
noSelection.lastname .getObs(EDITABLE).setValue(false);
noSelection.detailed .getObs(VALUE)   .setValue(false);    // detail view can fold

/**
 * @typedef SelectionControllerType<T>
 * @template T
 * @property { (T) => void } setSelectedModel
 * @property { ()  => T    } getSelectedModel
 * @property { () => void  } clearSelection
 * @property { (callback: onValueChangeCallback<T>) => void } onModelSelected
 */

/**
 * SelectionController takes a model that will serve as a representative of a selection.
 * Listeners to selection changes will react by synchronizing with the selection -
 * of by means of copying the qualifiers and thus allowing multi-way updates without unbind/rebind.
 * @template T
 * @param  { T } model - the model that is to represent the selection
 * @return { SelectionControllerType<T>}
 * @constructor
 */
const SelectionController = model => {

    const selectedModelObs = Observable(model);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected  : selectedModelObs.onChange,
        clearSelection   : () => selectedModelObs.setValue(noSelection),
    }
};
