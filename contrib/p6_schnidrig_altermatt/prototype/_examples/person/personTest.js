
// noinspection PointlessArithmeticExpressionJS

import { ListController, SelectionController,  } from './personController.js';
import { Person, selectionMold }                 from './person.js';
import { TestSuite }                             from "../../kolibri/util/test.js";
import { fireEvent, INPUT}                       from "../../kolibri/util/dom.js";
import {projectDetailView, projectMasterView}    from "./masterDetailProjector.js";

const personSuite = TestSuite("example/person/person");

personSuite.add("master add remove", assert => {
    // setup
    const detailCard            = document.createElement("div");
    const masterController      = ListController(Person);
    const selectionController   = SelectionController(selectionMold);
    // create the sub-views, incl. binding
    const [masterContainer]     = projectMasterView(masterController, selectionController);
    projectDetailView(selectionController, detailCard);

    const elementsPerRow = 1 + 2 * 2; // delete button plus 2 times label with input

    assert.is(masterContainer.children.length, 0*elementsPerRow);

    masterController.addModel();

    assert.is(masterContainer.children.length, 1*elementsPerRow);

    masterController.addModel();

    assert.is(masterContainer.children.length, 2*elementsPerRow);
    const firstDeleteButton = masterContainer.querySelectorAll("button")[0];

    firstDeleteButton.click();

    assert.is(masterContainer.children.length, 1*elementsPerRow);
});

personSuite.add("selections", assert => {
    // setup
    const detailCard            = document.createElement("div");
    const masterController      = ListController(Person);
    const selectionController   = SelectionController(selectionMold);
    // create the sub-views, incl. binding
    const [masterContainer]     = projectMasterView(masterController, selectionController);
    const [detail]              = projectDetailView(selectionController, detailCard);

    assert.is(masterContainer.querySelectorAll(".selected").length, 0);
    assert.is(detailCard.classList.contains("no-detail"), true);

    masterController.addModel(); // new person models are automatically selected

    assert.is(masterContainer.querySelectorAll(".selected").length, 1);
    assert.is(detailCard.classList.contains("no-detail"), false);

    masterController.addModel(); // adding another person must not result in two selections

    assert.is(masterContainer.querySelectorAll(".selected").length, 1);
    assert.is(detailCard.classList.contains("no-detail"), false);

    // deleting a person removes the selection and makes the detail view fade
    const firstDeleteButton = masterContainer.querySelectorAll("button")[0];
    firstDeleteButton.click();
    assert.is(masterContainer.querySelectorAll(".selected").length, 0);
    assert.is(detailCard.classList.contains("no-detail"), true);

    // no selection makes the detail view read-only
    assert.is(detail.querySelectorAll('input')          .length, 2);
    assert.is(detail.querySelectorAll('input[readonly]').length, 2);

});

// testing value changes in both the master and the detail view
// plus the effect of the converter (to uppercase)
// and the validator (min 3 chars, otherwise invalid)
personSuite.add("multi-way editing", assert => {
    // setup
    const detailCard            = document.createElement("div");
    const masterController      = ListController(Person);
    const selectionController   = SelectionController(selectionMold);
    // create the sub-views, incl. binding
    const [masterContainer]     = projectMasterView(masterController, selectionController);
    const [detail]              = projectDetailView(selectionController, detailCard);

    masterController.addModel(); // make two models,
    masterController.addModel(); // select the second one

    const lastnameInputs = masterContainer.querySelectorAll("input[id$='lastname']");
    const secondPersonLastnameInput = lastnameInputs[lastnameInputs.length-1];
    assert.isTrue(null != secondPersonLastnameInput);

    const detailInputs = detail.querySelectorAll("input");
    const detailLastnameInput = detailInputs[detailInputs.length-1];
    assert.isTrue(null != detailLastnameInput);

    assert.is(detailLastnameInput.value, "DOE");                            // start value
    assert.is(detailLastnameInput.value, secondPersonLastnameInput.value);

    detailLastnameInput.value = "other";
    fireEvent(detailLastnameInput, INPUT);

    assert.is(detailLastnameInput.value, "OTHER");                          // we have a converter in place
    assert.is(detailLastnameInput.value, secondPersonLastnameInput.value);

    assert.is(detailLastnameInput      .reportValidity(), true); // both are valid
    assert.is(secondPersonLastnameInput.reportValidity(), true);

    secondPersonLastnameInput.value = "xx";                                 // also works the other way
    fireEvent(secondPersonLastnameInput, INPUT);

    assert.is(detailLastnameInput.value, "XX");
    assert.is(detailLastnameInput.value, secondPersonLastnameInput.value);

    assert.is(detailLastnameInput      .reportValidity(), false); // both invalid because of min-2-char validator
    assert.is(secondPersonLastnameInput.reportValidity(), false);

});

personSuite.run();
