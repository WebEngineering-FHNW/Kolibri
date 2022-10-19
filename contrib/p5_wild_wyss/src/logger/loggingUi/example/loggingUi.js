import {Appender} from "../../appender/observableAppender";
import {LogFactory} from "../../logFactory";
import {LOG_INFO} from "../../logger";
import {LogUiController} from "../controller";
import {LogUiModel} from "../logUiModel";
import {LogMessagesContainerView} from "../logView";

const appender = Appender();

const logger = LogFactory("ch.fhnw")(() => LOG_INFO)(appender)(_1 => _2 => id);


const model = LogUiModel(appender);
const controller = LogUiController(model);
const logView = LogMessagesContainerView(rootElement, controller);