import { Controller }       from "./slotMachine.js";
import {ResultView, SlotMachineView} from "./slotMachineViews.js";

const slotMachineController = Controller();
SlotMachineView(document.getElementById("machine"), slotMachineController);
ResultView     (document.getElementById("result"),  slotMachineController);

