import {Controller, SlotMachineView} from "./slotMachine.js";

const slotMachineController = Controller();
SlotMachineView(document.getElementById("wheels"), slotMachineController);