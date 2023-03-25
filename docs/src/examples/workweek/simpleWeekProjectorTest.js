import { TestSuite }       from "../../kolibri/util/test.js";

import { WeekController }  from "./weekController.js";
import { WeekProjector }   from "./simpleWeekProjector.js";
import { fireChangeEvent } from "../../kolibri/util/dom.js";

const { projectWeek} = WeekProjector;

const simpleWeekProjectorSuite = TestSuite("examples/workweek/simpleWeekProjector");

/**
 * The purpose of a spike is not to test all possible user interactions and their outcome but rather
 * making sure that the view construction and the binding is properly set up.
 * Complex logic is to be tested against the controller (incl. model).
 */
simpleWeekProjectorSuite.add("spike", assert => {
    const root = document.createElement("fieldset"); // created but never mounted
    const weekController = WeekController();
    root.append(...projectWeek(weekController));

    assert.is(root.childElementCount, 6 * 4); // 5 days plus total * 4 divs per row

    const outputs = root.querySelectorAll("output");
    assert.is( outputs.length, 6);
    const grossTotalElement = outputs[outputs.length -1]; // the very last one.
    assert.is(grossTotalElement.textContent, "40:00");

    const firstInput = root.querySelector("input");
    firstInput.value = "08:01";
    fireChangeEvent(firstInput);
    assert.is(grossTotalElement.textContent, "39:59");
});

simpleWeekProjectorSuite.add("titleNameLabel", assert => {
    const root = document.createElement("fieldset"); // created but never mounted
    const weekController = WeekController();
    root.append(...projectWeek(weekController));

    const input = root.querySelector("input"); // first input

    assert.is( input.getAttribute("name"),  "Mon_am_start");
    assert.is( input.getAttribute("title"), "Mon AM Start");

    const label = root.querySelector("label"); // first label
    assert.is( label.textContent, "Mon AM Start");

});

simpleWeekProjectorSuite.run();
