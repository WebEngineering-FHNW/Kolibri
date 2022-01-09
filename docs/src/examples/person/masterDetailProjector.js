
import {
    projectForm,
    projectListItem,
    masterClassName,
    removeListItemForModel,
    selectListItemForModel
}                                           from "./instantUpdateProjector.js";
import {ALL_ATTRIBUTE_NAMES, selectionMold} from "./person.js";

export { projectMasterView, projectDetailView }

const projectMasterView = (listController, selectionController) => {

    /** @type HTMLDivElement */ const rootElement = document.createElement("div");

    const renderRow = person => {
        const rowElements = projectListItem(listController, selectionController, person, ALL_ATTRIBUTE_NAMES);
        rootElement.append(...rowElements);
        selectionController.setSelectedModel(person);
    }

    rootElement.classList.add(masterClassName);
    rootElement.style['grid-template-columns'] = '1.7em repeat(' + ALL_ATTRIBUTE_NAMES.length + ', auto);';

    // binding
    listController.onModelAdd(renderRow);
    listController.onModelRemove( removedModel => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement)(removedModel);
        ALL_ATTRIBUTE_NAMES.forEach( name => removedModel[name].setQualifier(undefined)); // remove model attributes from model world
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement));

    return [rootElement];
};


const projectDetailView = (selectionController, detailCard) => {

    const form = projectForm(selectionController, detailCard, selectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected( selectedPersonModel =>
        [...ALL_ATTRIBUTE_NAMES, "detailed"].forEach( name =>
            selectionMold[name].setQualifier(selectedPersonModel[name].getQualifier())
        )
    );

    selectionController.clearSelection();

    return form;
};
