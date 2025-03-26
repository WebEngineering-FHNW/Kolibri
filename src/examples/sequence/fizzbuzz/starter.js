import { FizzBuzzController } from "./fizzBuzzController.js";
import { FizzBuzzView }       from "./fizzBuzzView.js";

const rootElement     = document.getElementById("root");
const rulesController = FizzBuzzController();
FizzBuzzView(rulesController, rootElement);

rulesController.addRule(3, "fizz");
rulesController.addRule(5, "buzz");