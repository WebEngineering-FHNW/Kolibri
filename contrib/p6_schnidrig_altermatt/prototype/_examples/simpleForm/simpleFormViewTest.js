
import { TestSuite } from "../../kolibri/util/test.js";
import { start }     from "./starter.js";

const simpleFormViewSuite = TestSuite("examples/simpleForm/simpleFormView");

/**
 * The purpose of a spike is not to test all possible user interactions and their outcome but rather
 * making sure that the view construction and the binding is properly set up.
 * Complex logic is to be tested against the controller (incl. model).
 */
simpleFormViewSuite.add("spike", assert => {
    const root = document.createElement("div"); // created but never mounted
    root.append(...start(root));

    // assert properties of the generated DOM elements
    assert.is(root.querySelectorAll("label").length, 6);
    assert.is(root.querySelectorAll("input").length, 6);

    // work with DOM elements just like user would do in the browser
    const checkbox = root.querySelector("input[type=checkbox]");
    assert.is(checkbox.checked, false);
    checkbox.click();
    assert.is(checkbox.checked, true);

});

simpleFormViewSuite.run();
