import { TestSuite }                from "../../util/test.js";
import { projectForm }              from "./simpleFormProjector.js";
import { SimpleFormController }     from "./simpleFormController.js";

const simpleFormProjectorSuite = TestSuite("projector/simpleForm/simpleFormProjector");

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
