import {Controller, View} from "./fizzBuzz.js";

const rootElement = document.getElementById("root");
const rulesController = Controller();
View(rulesController, rootElement);
rulesController.addRule(3, "fizz");
rulesController.addRule(5, "buzz");
