import { dom }                              from "../../kolibri/util/dom.js";
import { VALUE }                            from "../../kolibri/presentationModel.js";
import { projectInstantInput }              from "../../kolibri/projector/simpleForm/simpleInputProjector.js";
import { SimpleAttributeInputController }   from "../../kolibri/projector/simpleForm/simpleInputController.js";

export { projectListItem, selectListItemForModel, removeListItemForModel, projectForm,  masterClassName, pageCss }

const masterClassName = 'instant-update-master'; // should be unique for this projector
const detailClassName = 'instant-update-detail';

/**
 *
 * @param attributeName
 * @param model
 * @return {string}
 */
const elementId = (attributeName, model) =>
    (masterClassName + "-" + model[attributeName].getQualifier()).replaceAll("\.","-");

const deleteButtonId = (attributeNames, model) => {
    const representativeAttributeName = attributeNames[0];
    return (masterClassName + "-delete-" + model[representativeAttributeName].getQualifier()).replaceAll("\.","-");
};

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

const removeListItemForModel = (attributeNames, root) => model => {
    const deleteButton = root.querySelector("#" + deleteButtonId(attributeNames, model));
    if (deleteButton) {
        deleteButton.parentElement.removeChild(deleteButton);               // remove delete button
    }
    attributeNames.forEach( attributeName => {
        const id = elementId(attributeName, model);
        const inputElement = root.querySelector("#"+id);
        if ( inputElement) {                                                // remove all input elements of this row
            inputElement.parentElement.removeChild(inputElement);
        }
        const labelElement = root.querySelector(`label[for="${id}"]`);
        if (labelElement ){
            labelElement.parentElement.removeChild(labelElement);           // remove all label elements of this row
        }
    });
};

const projectListItem = (masterController, selectionController, model, attributeNames) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removeModel(model);
    deleteButton.id         = deleteButtonId(attributeNames, model);

    const elements          = [];

    attributeNames.forEach( attributeName => {

        const inputController = SimpleAttributeInputController(model[attributeName]);
        const [labelElement, inputElement] = projectInstantInput("ListItem", inputController);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        // id's have been dynamically generated, but we have to change that
        // (and keep the input.id and label.for consistency intact)
        const id = elementId(attributeName, model);
        inputElement.setAttribute("id" ,id);
        labelElement.setAttribute("for",id);
        elements.push(labelElement, inputElement);
    });

    return [ deleteButton, ...elements];
};



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
    })

    return elements;
};


const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-gap:       0.5em;
        grid-row-gap:   0.5em;
        grid-template-columns: 1.7em auto auto; /* default: to be overridden dynamically */
        margin-bottom:  0.5em ;
    }
    .${masterClassName} label { /* labels are not shown in the master view but are in the dom for validity */
        display:        none;
    }
    .${detailClassName} {
        display:        grid;
        grid-gap:       0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
    .no-detail {
        opacity:        0.2;
        transition:     transform ease-both 0.5s;
        transition-delay: 200ms;
        transform:      rotateX(-60deg);
        transform-origin: top center;
    }    
    .delete {
        background-color:   transparent;
        border:             none;
        color:              var(--kolibri-accent-color);
        font-size:          1.3em;
    }    
    button.selected {
        background: var(--kolibri-select-color);
    }    
`;
