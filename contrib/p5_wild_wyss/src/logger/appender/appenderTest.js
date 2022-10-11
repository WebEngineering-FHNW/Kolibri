// import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
// import {LOG_DEBUG} from "../logger.js";
// import {id} from "../../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js"
// import {Appender} from "./arrayAppender.js";
//
// const formatter = _ => id;
// const convertToJsBool = b => b(true)(false);
//
// const { debug, setActiveLogLevel, getAppenderValue, reset } = Appender(formatter);
// setActiveLogLevel(LOG_DEBUG);
//
// const loggerSuite = TestSuite("Logger Appender");
//
// loggerSuite.add("test add debug value to array appender", assert => {
//   const result = debug("debug");
//   assert.is(convertToJsBool(result), true );
//   assert.is(getAppenderValue()[0], "debug");
//   reset();
// });
//
// loggerSuite.add("test add tow value to array appender", assert => {
//   const result1 = debug("first");
//   const result2 = debug("second");
//   assert.is(convertToJsBool(result1), true );
//   assert.is(convertToJsBool(result2), true );
//   assert.is(getAppenderValue()[0], "first");
//   assert.is(getAppenderValue()[1], "second");
//   reset();
// });
//
// loggerSuite.add("test reset array appender", assert => {
//   const result1 = debug("first");
//   assert.is(convertToJsBool(result1), true );
//   assert.is(getAppenderValue()[0], "first");
//   reset();
//   assert.isTrue(0 === getAppenderValue().length);
// });
//
// loggerSuite.run();
