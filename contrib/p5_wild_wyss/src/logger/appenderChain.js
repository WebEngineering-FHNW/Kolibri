import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {LogFactory} from "./logFactory.js";
import {Appender as ArrayAppender}    from "./appender/arrayAppender.js";
import {Appender as StringAppender}   from "./appender/stringAppender.js";
import {Appender as ConsoleAppender}  from "./appender/consoleAppender.js";
import {Appender as CountAppender}    from "./appender/countAppender.js";import {id} from "./lamdaCalculus.js"

const loggerSuite = TestSuite("Appender Chain");

loggerSuite.add("test", assert => {


  const activeAppender = () => [ConsoleAppender(), ArrayAppender(), StringAppender()];


  const { info, debug, error } = LogFactory(activeAppender)("ch.fhnw")(_1 => _2 => id);
  info("Andri");
  debug("Wild");
  error("Tobias")
  console.log(StringAppender().getValue())


  assert.is(true, true)
});

loggerSuite.run();