import { asyncTest, TestSuite }              from "../../util/test.js";
import { fireChangeEvent, fireEvent, INPUT } from "../../util/dom.js";
import { InputProjector }                    from "./simpleInputProjector.js";
import { SimpleInputController }             from "./simpleInputController.js";

const { projectChangeInput, projectDebounceInput } = InputProjector;

const simpleInputProjectorSuite = TestSuite("projector/simpleForm/simpleInputProjector");

/**
 * The purpose of this binding spike is not to test all possible user interactions and their outcome but rather
 * making sure that the view construction and the binding is properly set up.
 * Complex logic is to be tested against the controller (incl. model).
 */
simpleInputProjectorSuite.add("binding", assert => {
    const controller = SimpleInputController({
        value:  "Text",
        label:  "Text",
        name:   "text",
        type:   "text",
    });
    const [labelElement, spanElement] = projectChangeInput(controller, "TEST");
    const inputElement = spanElement.querySelector("input");
    assert.is(labelElement.getAttribute("for"),     inputElement.getAttribute("id"));
    assert.is(spanElement .getAttribute("data-id"), inputElement.getAttribute("id"));

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
simpleInputProjectorSuite.add("checkbox", assert => {
    const controller = SimpleInputController({
        value:  false,
        label:  "Check",
        name:   "check",
        type:   "checkbox",
    });

    const [labelElement, spanElement] = projectChangeInput(controller, "TEST");
    const inputElement = spanElement.querySelector("input");
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


// Testing the special time case since the "value" attribute is a string in the format "hh:mm"
// while the model stores it as number meaning minutes since midnight.
simpleInputProjectorSuite.add("time", assert => {
    const controller = SimpleInputController({
        value:  12 * 60 + 15,
        label:  "Time",
        name:   "time",
        type:   "time",
    });
    const [labelElement, spanElement] = projectChangeInput(controller, "TEST");
    const inputElement = spanElement.querySelector("input");
    assert.is(labelElement.getAttribute("for"), inputElement.getAttribute("id"));

    // initial checkbox value is false
    assert.is(controller.getValue(), 12 * 60 + 15);
    assert.is(inputElement.value, "12:15");

    inputElement.value = "11:00";
    fireChangeEvent(inputElement);

    assert.is(controller.getValue(), 11 * 60);
    assert.is(inputElement.value, "11:00");

    inputElement.value = "no-such-time";
    fireChangeEvent(inputElement);

    assert.is(controller.getValue(), 0);
    assert.is(inputElement.value, "00:00");
});



asyncTest("projector/simpleForm/debounce (async)", assert => {

    const controller = SimpleInputController({
        value:  "Text",
        label:  "Text",
        name:   "text",
        type:   "text",
    });
    const debounceTimeMs= 100;
    const waitForDebounceTimeMs = debounceTimeMs * 2;
    const [_, spanElement] = projectDebounceInput(debounceTimeMs)(controller, "TEST");
    const inputElement = spanElement.querySelector("input");

    return new Promise(resolve => {    // test the binding
        inputElement.value = "new value";
        fireEvent(inputElement, INPUT);
        assert.is(controller.getValue(), "Text"); // value is not yet set

        setTimeout( () => {
            assert.is(controller.getValue(), "new value"); // now it is
            resolve();
        }, waitForDebounceTimeMs)
    });
}
);


simpleInputProjectorSuite.run();
