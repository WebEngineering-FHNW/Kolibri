import { TestSuite } from "./util/test.js";

import { clientId }  from "./version.js";

const versionSuite = TestSuite("version");

versionSuite.add("clientId", assert => {
    assert.is(clientId.length, 22);
    assert.is(clientId, clientId);  // does not change

});

versionSuite.run();
