import { TestSuite }          from "./test.js";
import {dom, fireChangeEvent} from "./dom.js";

const domSuite = TestSuite("util/dom");

domSuite.add("dom", assert => {
    const [resultElement] = dom('<section></section>');
    assert.is( resultElement instanceof HTMLElement, true);
});

domSuite.add("fire-event", assert => {
    const [inputElement] = dom('<input type="text" value="old"/>');
    let value = "";
    inputElement.onchange = _ => value = inputElement.value;
    assert.is(value,"");
    fireChangeEvent(inputElement);
    assert.is(value,"old");
    inputElement.value = "new";
    assert.is(value,"old"); // not yet seen since event not yet fired
    fireChangeEvent(inputElement);
    assert.is(value, "new");
});

domSuite.run();
