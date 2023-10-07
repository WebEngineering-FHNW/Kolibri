import { dom }                              from "../../kolibri/util/dom.js";
import { VALUE }                            from "../../kolibri/presentationModel.js";
import { projectInstantInput }              from "../../kolibri/projector/simpleForm/simpleInputProjector.js";
import { SimpleAttributeInputController }   from "../../kolibri/projector/simpleForm/simpleInputController.js";

export { projectListItem, selectListItemForModel, removeListItemForModel, projectForm,  masterClassName, pageCss }

/**
 * A name that serves multiple purposes as it allows setting up specific css styling by using a consistent
 * style class name. It also facilitates creating unique identifiers within the generated views.
 * It should be unique among all css class names that are used in the application.
 * Future developers might want this information to be passed in from the outside to allow more flexibility.
 * @type { String }
 */
const masterClassName = 'instant-update-master';

/** @private */
const detailClassName = 'instant-update-detail';

/**
 * Returns a unique id for the html element that is to represent the attribute such that we can create the
 * element in a way that allows later retrieval when it needs to be removed.
 * The resulting String should follow the constraints for properly formatted html ids, i.e. not dots allowed.
 * @template T
 * @private
 * @pure
 * @param  { String } attributeName
 * @param  { T }      model
 * @return { String }
 */
const elementId = (attributeName, model) =>
    (masterClassName + "-" + model[attributeName].getQualifier()).replaceAll("\.","-");

/**
 * Returns a unique id for the html delete button that is to represent the model such that we can create the
 * element in a way that allows later retrieval when it needs to be removed.
 * The resulting String should follow the constraints for properly formatted html ids, i.e. not dots allowed.
 * @template T
 * @private
 * @pure
 * @param  { String[] } attributeNames
 * @param  { T }        model
 * @return { String }
 */
const deleteButtonId = (attributeNames, model) => {
    const representativeAttributeName = attributeNames[0];
    return (masterClassName + "-delete-" + model[representativeAttributeName].getQualifier()).replaceAll("\.","-");
};

/**
 * When a selection changes, the change must become visible in the master view.
 * The old selected model must be deselected, the new one selected.
 * @template T
 * @param { String[] }    attributeNames
 * @param { HTMLElement } root
 * @return { (newModel:T, oldModel:T) => void}
 */
const selectListItemForModel = (attributeNames, root) => (newModel, oldModel) => {
    const oldDeleteButton = root.querySelector("#" + deleteButtonId(attributeNames, oldModel));
    if (oldDeleteButton) {
        oldDeleteButton.classList.remove("selected");
    }
    const newDeleteButton = root.querySelector("#" + deleteButtonId(attributeNames, newModel));
    if (newDeleteButton) {
        newDeleteButton.classList.add("selected");
    }
};

/**
 * When a model is removed from the master view, the respective view elements must be removed as well.
 * @template T
 * @param { String[] }    attributeNames
 * @param { HTMLElement } root
 * @return { (model:T) => void }
 */
const removeListItemForModel = (attributeNames, root) => model => {
    const deleteButton = root.querySelector("#" + deleteButtonId(attributeNames, model));
    if (deleteButton) {
        deleteButton.parentElement.removeChild(deleteButton);               // remove delete button
    }
    attributeNames.forEach( attributeName => {
        const id = elementId(attributeName, model);
        const spanElement = root.querySelector(`span[data-id=${id}]`);
        if ( spanElement) {                                                // remove all input elements of this row
            spanElement.parentElement.removeChild(spanElement);
        }
        const labelElement = root.querySelector(`label[for="${id}"]`);
        if (labelElement ){
            labelElement.parentElement.removeChild(labelElement);           // remove all label elements of this row
        }
    });
};

/**
 * Creating the views and bindings for an item in the list view, binding for instant value updates.
 * @template T
 * @param { ListControllerType<T> }         listController
 * @param { SelectionControllerType<T> }    selectionController
 * @param { T }                             model
 * @param { String[] }                      attributeNames
 * @return { HTMLElement[] }
 */
const projectListItem = (listController, selectionController, model, attributeNames) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => listController.removeModel(model);
    deleteButton.id         = deleteButtonId(attributeNames, model);

    const elements          = [];

    attributeNames.forEach( attributeName => {

        const inputController = SimpleAttributeInputController(model[attributeName]);
        const [labelElement, spanElement] = projectInstantInput("ListItem", inputController);
        const inputElement   = spanElement.querySelector("input");
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        // id's have been dynamically generated, but we have to change that
        // (and keep the input.id and label.for consistency intact)
        const id = elementId(attributeName, model);
        spanElement .setAttribute("data-id",    id); // we will need that later when removing
        inputElement.setAttribute("id",         id);
        labelElement.setAttribute("for",        id);
        elements.push(labelElement, spanElement);
    });

    return [ deleteButton, ...elements];
};



/**
 * Creating the views and bindings for an item in the list view, binding for instant value updates.
 * @template T
 * @param {SelectionControllerType<T>}    detailController
 * @param { HTMLElement }                   detailCard
 * @param { T }                             model
 * @param { String[] }                      attributeNames
 * @return { HTMLFormElement[] }
 */
const projectForm = (detailController, detailCard, model, attributeNames) => {

    const personInputControllers = attributeNames.map( name => SimpleAttributeInputController(model[name]));

    // create view
    const elements = dom(`
		<form>
			<div class="${detailClassName}">
			</div>
		</form>
    `);
    /** @type { HTMLFormElement } */ const form = elements[0];
    const div = form.children[0];

    personInputControllers.forEach(inputController => div.append(...projectInstantInput(detailClassName,inputController)));

    model.detailed.getObs(VALUE).onChange( newValue => {
        if (newValue) {
            detailCard.classList.remove("no-detail");
        } else {
            detailCard.classList.add("no-detail");
        }
    });

    return [ form ];
};

/**
 * CSS snippet to append to the head style when using the instant update projector.
 * @type { String }
 * @example
 * document.querySelector("head style").textContent += pageCss;
 */
const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-gap:       0.5em;
        grid-row-gap:   0.5em;
        grid-template-columns: 2em auto auto; /* default: to be overridden dynamically */        
        align-items:    baseline;
        margin-bottom:  0.5em ;
    }
    .${masterClassName} label { /* labels are not shown in the master view but are in the dom for validity */
        display:        none;
    }
    .${detailClassName} {
        display:            grid;
        grid-gap:           0.5em;
        grid-template-columns: 1fr 3fr;
        align-items:        baseline;
        margin-bottom:      0.5em ;
    }
    .no-detail {
        opacity:            0.2;
        transition:         transform ease-both 0.5s;
        transition-delay:   200ms;
        transform:          rotateX(-60deg);
        transform-origin:   top center;
    }    
    .delete {
        background-color:   transparent;
        border:             none;
        color:              var(--kolibri-color-accent);
        font-size:          1.3em;
    }    
    .card h1 {
        font-family:        var(--font-sans-serif);
        margin-top:         0;
    }
    button.selected {
        position:           relative;
    }    
    button.selected::before {
        content:            '';
        position:           absolute;        
        inset:              0 0 0 0;       
        background:         var(--kolibri-color-select);
        transform:          translateX(-100%);
        clip-path:          polygon(0 0, 100% 50%, 0 100%);
    }
`;
