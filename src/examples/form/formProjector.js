import { dom }               from "../../kolibri/util/dom.js";
export { projectInput, projectForm, FORM_CSS }

let counter = 0;

const projectInput = (inputController, root) => {
    const id = "id-" + (counter++);
    // create view
    const [labelElement, inputElement] = dom(`
        <label for="${id}"></label>
        <input type="text" id="${id}">
    `);

    // view binding
    inputElement.onchange = _ => inputController.setText(inputElement.value);

    // data binding
    inputController.onTextChanged      (val => inputElement.value = val);
    inputController.onTextLabelChanged (label => {
        labelElement.textContent = label;
        inputElement.setAttribute("title", label);
    });
    inputController.onTextNameChanged  (name  => inputElement.setAttribute("name", name));
    inputController.onTextTypeChanged  (type  => inputElement.setAttribute("type", type));
    inputController.onTextValidChanged (valid => inputElement.setCustomValidity(valid ? "" : "invalid"));

    root.appendChild(labelElement);
    root.appendChild(inputElement);
}

const FORM_CLASS_NAME = "kolibri-examples-form";

const projectForm = (formController, root) => {
    // create view
    const [form] = dom(`
		<form>
			<fieldset class="${FORM_CLASS_NAME}">
			</fieldset>
		</form>
    `);
    const fieldset = form.children[0];

    formController.inputControllers.forEach(inputController => projectInput(inputController, fieldset));

    root.appendChild(form);
}

const FORM_CSS = `
    fieldset.${FORM_CLASS_NAME} {        
        padding: 2em;
        display: grid;
        grid-template-columns: max-content max-content;
        grid-row-gap:   .5em;
        grid-column-gap: 2em;        
    }
`;
