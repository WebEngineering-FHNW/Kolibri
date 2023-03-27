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
 * @typedef ListControllerType<_T_>
 * @template _T_
 * @property { (cb:ConsumerType<_T_>) => void } onModelAdd
 * @property { (cb:ConsumerType<_T_>) => void } onModelRemove
 * @property { (model:_T_) => void }            removeModel
 * @property { ()  => void }                    addModel - add a newly created model
 */

/**
 * ListController maintains an observable list of arbitrary models.
 * In order to construct models, it takes a modelConstructor as parameter.
 * @template _T_
 * @param  { () => _T_ } modelConstructor - a constructor for models that are to be maintained here.
 * @return { ListControllerType<_T_> }
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
const createNoSelection = () => {
    const result = reset(Person());
    result.firstname.setQualifier("Person.none.firstname");
    result.lastname .setQualifier("Person.none.lastname");
    result.detailed .setQualifier("Person.none.detailed");
    result.firstname.getObs(EDITABLE).setValue(false); // the non-selection is not editable
    result.lastname .getObs(EDITABLE).setValue(false);
    result.detailed .getObs(VALUE)   .setValue(false);    // detail view can fold
    return result
};
const noSelection = createNoSelection(); // the value to pass around, it's qualifiers might get changed
createNoSelection(); // create a second noSelection that can never be passed around and keeps the attributes in the ModelWorld
                     // dk: we should find a nicer way to do that.

/**
 * @typedef SelectionControllerType<_T_>
 * @template _T_
 * @property { (_T_) => void } setSelectedModel
 * @property { ()  => _T_    } getSelectedModel
 * @property { () => void  }   clearSelection
 * @property { (cb: ValueChangeCallback<_T_>) => void } onModelSelected
 */

/**
 * SelectionController takes a model that will serve as a representative of a selection.
 * Listeners to selection changes will react by synchronizing with the selection -
 * of by means of copying the qualifiers and thus allowing multi-way updates without unbind/rebind.
 * @template _T_
 * @param  { _T_ } model - the model that is to represent the selection
 * @return { SelectionControllerType<_T_>}
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
