
import { TestSuite, asyncTest } from "../../kolibri/util/test.js"
import { ForgetfulScheduler }   from "./lastWins.js"

const lastWinsSuite = TestSuite("example/blt/lastWins");

asyncTest("latestWins (async)", assert => {

    const result = [];

    const scheduler = ForgetfulScheduler();

    scheduler.add(ok =>
      setTimeout(_ => {   // the first one will start even though it takes time to complete
          result.push(0);
          ok();
      }, 100));
    scheduler.add(ok => {   // this one might be dropped
        result.push(1);
        ok();
    });
    scheduler.add(ok => {   // we push "immediately", dropping the previous one
        result.push(2);
        ok();
    });

    return new Promise(resultDone => {
        setTimeout(_ => {               // give the scheduler time to finish
            console.log(result);        // todo: remove
            assert.is(result.length, 2);
            assert.is(result[0], 0);
            assert.is(result[1], 2);
            resultDone();
        }, 100);

    });
});

lastWinsSuite.run();
