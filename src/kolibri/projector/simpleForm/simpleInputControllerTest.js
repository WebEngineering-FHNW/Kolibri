import { TestSuite }             from "../../util/test.js";
import { SimpleInputController } from "./simpleInputController.js";

const simpleInputControllerSuite = TestSuite("projector/simpleForm/simpleInputController");

simpleInputControllerSuite.add("full", assert => {
    const controller = SimpleInputController({
        value:  "Dierk",
        label:  "First Name",
        name:   "firstname",
        type:   "text",
    });
    assert.is(controller.getValue(), "Dierk");
    assert.is(controller.getType(),  "text");

    let found = false;
    controller.onValueChanged( () => found = true );
    assert.is(found, true); // callback is called when registering
    found = false;
    controller.setValue("other value");
    assert.is(found, true);
});

simpleInputControllerSuite.run();
