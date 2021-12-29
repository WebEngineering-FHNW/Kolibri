import { TestSuite }                 from "../../util/test.js";
import { fireChangeEvent }           from "../../util/dom.js";
import { projectForm, projectInput } from "./simpleFormProjector.js";
import { SimpleInputController }     from "./simpleInputController.js";
import { SimpleFormController }      from "./simpleFormController.js";

const simpleFormProjectorSuite = TestSuite("projector/simpleForm/simpleFormProjector");

/**
 * The purpose of this binding spike is not to test all possible user interactions and their outcome but rather
 * making sure that the view construction and the binding is properly set up.
 * Complex logic is to be tested against the controller (incl. model).
 */
simpleFormProjectorSuite.add("binding", assert => {
    const controller = SimpleInputController({
        value:  "Text",
        label:  "Text",
        name:   "text",
        type:   "text",
    });
    const [labelElement, inputElement] = projectInput(controller);

    assert.is(labelElement.getAttribute("for"), inputElement.getAttribute("id"));

    // test the binding
    inputElement.value = "new value";
    fireChangeEvent(inputElement);
    assert.is(controller.getValue(), "new value");

    controller.setValue("new value 2");
    assert.is(inputElement.value, "new value 2");
});

// Testing the special checkbox case since the "value" attribute has a different meaning
// and the actual value is tracked in the "checked" attribute while "value" is only used if
// checked is true, in which case the value is set to "on" by the browser.
simpleFormProjectorSuite.add("checkbox", assert => {
    const controller = SimpleInputController({
        value:  false,
        label:  "Check",
        name:   "check",
        type:   "checkbox",
    });

    const [labelElement, inputElement] = projectInput(controller);
    assert.is(labelElement.getAttribute("for"), inputElement.getAttribute("id"));

    // initial checkbox value is false
    assert.is(controller.getValue(), false);
    assert.is(inputElement.checked, false);
    // the value makes no sense asserting in the false case: assert.is(inputElement.value, "on");

    inputElement.click();
    fireChangeEvent(inputElement);

    assert.is(controller.getValue(), true);
    assert.is(inputElement.checked, true);
    assert.is(inputElement.value, "on");  // set by browser

    controller.setValue(false);

    assert.is(controller.getValue(), false);
    assert.is(inputElement.checked, false);
});

simpleFormProjectorSuite.add("form", assert => {
    const formController = SimpleFormController([
        {value: "Dierk", type: "text"  },
        {value: 0,       type: "number"},
    ]);
    const [form] = projectForm(formController);

    // make sure the view has been created and bound
    const [textController, numberController] = formController;
    assert.is(form.querySelector("input[type=text]").value,   textController.getValue());
    assert.is(form.querySelector("input[type=number]").value, numberController.getValue().toString());
});

simpleFormProjectorSuite.run();
