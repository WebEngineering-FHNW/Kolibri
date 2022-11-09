import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {LogFactory} from "./logFactory.js";
import {Appender as ArrayAppender}    from "./appender/arrayAppender.js";
import {Appender as ConsoleAppender}  from "./appender/consoleAppender.js";

const loggerSuite = TestSuite("Appender Chain");

loggerSuite.add("test", assert => {


  const activeAppender = () => [ConsoleAppender(), ArrayAppender()];


  const { info, debug, error } = LogFactory(activeAppender)("ch.fhnw")(_1 => _2 => id);
  info("Andri");
  debug("Wild");
  error("Tobias")


  assert.is(true, true)
});

loggerSuite.run();