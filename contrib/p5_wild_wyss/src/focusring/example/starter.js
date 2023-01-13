import { SlotMachineController }                 from "./slotMachine.js";
import {ResultView, SlotMachineView}  from "./slotMachineViews.js";

const slotMachineController = SlotMachineController();
SlotMachineView(document.getElementById("machine"), slotMachineController);
ResultView     (document.getElementById("result"),  slotMachineController);
