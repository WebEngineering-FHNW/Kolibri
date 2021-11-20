import { TestSuite } from "./test.js";
import { dom } from "./dom.js";

const domSuite = TestSuite("util-dom");

domSuite.add("dom", assert => {
    const [resultElement] = dom('<section></section>');
    assert.is( resultElement instanceof HTMLElement, true);
});

domSuite.run();
