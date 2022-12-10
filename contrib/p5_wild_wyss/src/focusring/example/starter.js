import { Controller, SlotMachineView, LeverView } from "./slotMachine.js";

const slotMachineController = Controller();
SlotMachineView(document.getElementById("wheels"), slotMachineController);
LeverView(document.getElementById("lever-boundary"), slotMachineController);