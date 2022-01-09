import {Attribute, EDITABLE, LABEL, TYPE, VALUE} from "../../kolibri/presentationModel.js";
import {
    formProjector,
    listItemProjector,
    masterClassName,
    removeListItemForModel,
    selectListItemForModel
}                                                from "./instantUpdateProjector.js";

export { MasterView, DetailView, Person, selectionMold, reset, ALL_ATTRIBUTE_NAMES }

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname'];

let idCounter = 0;
const nextId = () => idCounter++;

const Person = () => {                               // facade
    const id = nextId();
    const firstnameAttr = Attribute("John", `Person.${id}.firstname`);
    firstnameAttr.getObs(LABEL)     .setValue("First Name");
    firstnameAttr.getObs(TYPE)      .setValue("text");
    firstnameAttr.getObs(EDITABLE)  .setValue(true);

    const lastnameAttr  = Attribute("Dow", `Person.${id}.lastname`);
    lastnameAttr.getObs(LABEL)      .setValue("Last Name");
    lastnameAttr.getObs(TYPE)       .setValue("text");
    lastnameAttr.getObs(EDITABLE)   .setValue(true);

    // whether this person should appear in a detail view
    const detailedAttr  = Attribute(true, `Person.${id}.detailed`);

    lastnameAttr.setConverter( input => input.toUpperCase() );  // enable for playing around
    lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
        detailed:           detailedAttr,
        toString: () => firstnameAttr.getObs(VALUE).getValue() + " " + lastnameAttr.getObs(VALUE).getValue(),
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {

    const renderRow = person => {
        const rowElements = listItemProjector(listController, selectionController, person, ALL_ATTRIBUTE_NAMES);
        rootElement.append(...rowElements);
        selectionController.setSelectedModel(person);
    }

    rootElement.classList.add(masterClassName);
    rootElement.style['grid-template-columns'] = '1.7em repeat(' + ALL_ATTRIBUTE_NAMES.length + ', auto);';

    // binding
    listController.onModelAdd(renderRow);
    listController.onModelRemove( (removedModel, removeMe) => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement)(removedModel);
        ALL_ATTRIBUTE_NAMES.forEach( name => removedModel[name].setQualifier(undefined)); // remove model attributes from model world
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement));
};

const reset = person => {
    ALL_ATTRIBUTE_NAMES.forEach( name => {
        person[name].setQualifier(undefined);
        person[name].setConvertedValue("");
    });
    return person;
};

/**
 * Fixed, singleton, extra person model instance that represents the current selection.
 * Rather than storing a reference to the selected person model, we let the attribute values
 * (observable values for each attribute plus possible qualifiers)
 * of the selected person "flow" into this "mold".
 * Multi-way editing is achieved via automated qualifier synchronization.
 * Some frameworks call this a "proxy".
 */
const selectionMold = reset(Person()); // make a new empty Person model to start with

const DetailView = (selectionController, detailCard) => {

    const form = formProjector(selectionController, detailCard, selectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected( selectedPersonModel =>
        [...ALL_ATTRIBUTE_NAMES, "detailed"].forEach( name =>
            selectionMold[name].setQualifier(selectedPersonModel[name].getQualifier())
        )
    );

    selectionController.clearSelection();

    return form;
};
