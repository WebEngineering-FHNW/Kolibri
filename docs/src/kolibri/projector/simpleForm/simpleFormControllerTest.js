import { TestSuite }                       from "../../util/test.js";
import { SimpleFormController }            from "./simpleFormController.js";

const simpleFormControllerSuite = TestSuite("projector/simpleForm/simpleFormController");

simpleFormControllerSuite.add("small", assert => {
    const controller = SimpleFormController([
        {value: "Dierk", type: "text"  },
        {value: 0,       type: "number"},
    ]);
    const [nameController, lengthController] = controller;

    // example "business rule": the number value must always follow the length the name
    nameController.onValueChanged( val => lengthController.setValue(val.length));

    // assert the effect of the binding
    assert.is(lengthController.getValue(), "Dierk".length);
    nameController.setValue("");
    assert.is(lengthController.getValue(), "".length);

});

simpleFormControllerSuite.run();
