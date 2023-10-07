import { TestSuite }                        from "../../util/test.js";
import { SimpleInputModel }                 from "./simpleInputModel.js";
import { LABEL, NAME, TYPE, VALUE, VALID }  from "../../presentationModel.js";

const simpleInputModelSuite = TestSuite("projector/simpleForm/simpleInputModel");

simpleInputModelSuite.add("full", assert => {
    const model = SimpleInputModel({
        value:  "Dierk",
        label:  "First Name",
        name:   "firstname",
        type:   "text",
    });
    assert.is(model.hasObs(VALUE), true);
    assert.is(model.hasObs(TYPE),  true);
    assert.is(model.hasObs(NAME),  true);
    assert.is(model.hasObs(LABEL), true);
    assert.is(model.hasObs(VALID), true);
});

simpleInputModelSuite.add("slim", assert => {
    const model = SimpleInputModel({
        value:  "Dierk"
    });
    assert.is(model.hasObs(VALUE), true);
    assert.is(model.hasObs(TYPE),  true);
    assert.is(model.hasObs(NAME),  false); // when name  is not given, no observable is created at construction time
    assert.is(model.hasObs(LABEL), false); // when label is not given, no observable is created at construction time
});

simpleInputModelSuite.run();
