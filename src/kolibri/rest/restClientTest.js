import { asyncTest } from "../util/test.js";
import { client }    from "./restClient.js";

asyncTest("rest/restClient (async)", assert =>
    // will run async - out of order - return a promise such that reporting can start when fulfilled

    client(window.location.href.replace("allTests.html","kolibri/rest/testData.json"))
        .then( todo => assert.is(todo['title'], "delectus aut autem"))
);

