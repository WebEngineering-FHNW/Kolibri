import {LogFactory} from "../../logFactory.js";
import {LOG_INFO} from "../../logger.js";
import {Appender} from "../../appender/observableAppender.js";
import {createLogUi} from "./loggingUi.js";
import {id} from "../../lamdaCalculus.js";


const appender = Appender();

const logger = LogFactory("ch.fhnw")(() => LOG_INFO)(appender)(_1 => _2 => id);

const container = document.getElementById("container");

createLogUi(container);

setInterval(() => {
  logger.info("Tobias");
}, 1000);