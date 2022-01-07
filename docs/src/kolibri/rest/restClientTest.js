import { asyncTest } from "../util/test.js";
import { client }    from "./restClient.js";

asyncTest("rest/restClient (async)", assert =>
    // will run async - out of order - return a promise such that reporting can start when fulfilled
    // The special case here is that the implementation itself uses a promise that we expect to fail,
    // and thus we have to flip resolve/reject for the test result.
    new Promise( (resolve, reject) =>
        client('https://jsonplaceholder.typicode.com/todos/1')
            .then( _json => {
                assert.is("expected to fail","because of same-origin mismatch");
                reject();
            })
            .catch(err => {
                assert.isTrue(err.toString().startsWith("TypeError:"));
                console.log("'Fetch API cannot load' is expected in the error log.");
                resolve();
            } )
));

