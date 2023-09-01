import { FocusRing }  from "../focusRing.js";
import { pipe, map }  from "../../sequence/sequence.js";
import { Observable } from "../../../../../docs/src/kolibri/observable.js"
import { Range }      from "../../sequence/sequence.js";

export { SlotMachineController, ROTATION_SPEED }

const ROTATION_SPEED = 100;
const SLOT_CHARS     = ["&#9917;", "&#127866;", "&#127866;", "&#127866;", "&#127921;", "&#127922;", "&#127891;"];
const WHEEL_COUNT    = 3;

/**
 * The model manages the data held in the observables.
 *
 * @param  { Array<String> } slotChars
 * @returns { SlotMachineModelType }
 * @constructor
 */
const SlotMachineModel = slotChars => {

  const isRunning = Observable(false);

  /**
   * Returns a randomly shuffled copy of the given array.
   *
   * @template _T_
   * @param   { Array<_T_> } array
   * @returns { Array<_T_> } the shuffled array
   */
  const shuffle = array =>
      // Math.random() returns a number between [0,1]. If the result, of the compareFn >= 0, a is first.
      [...array].sort((_a, _b) => 0.5 - Math.random());

  /** @type {Array<IObservable<FocusRingType>>} */
  const wheels = [
    ...pipe(
      map(_ => FocusRing(shuffle(slotChars))),
      map(Observable)
    )(Range(WHEEL_COUNT-1))
  ];

  return {
    wheels:            wheels.map(w => ({ getValue: w.getValue, setValue: w.setValue, onChange: w.onChange })),
    isRunning:         isRunning.getValue,
    setIsRunning:      isRunning.setValue,
    onIsRunningChange: isRunning.onChange,
  };
};

/**
 * Processes the actions from the user interface and manages the model.
 *
 * @returns { SlotMachineControllerType }
 * @constructor
 */
const SlotMachineController = () => {

  const model = SlotMachineModel(SLOT_CHARS);

  /**
   * Starts the rotation of the slot machine wheels.
   */
  const startEngine = () => {
    if(model.isRunning()) return;
    model.setIsRunning(true);

    const minimalRunTime = 200 + Math.random() * 1000;

    model.wheels.map( obs =>
        setInterval(() => obs.setValue(obs.getValue().right()), ROTATION_SPEED))
        .forEach(clearIntervalAfterTimout(minimalRunTime));
  };

  /**
   * Calculates wheel rotation time and stop it after a timeout.
   *
   * @param { Number } runTime - the minimal runtime
   */
  const clearIntervalAfterTimout = runTime => (intervalId, idx) => {
    runTime += 500 + Math.random() * 300; // do not stop all wheels at once
    const isLast = idx === model.wheels.length - 1;
    setTimeout(() => {
      clearInterval(intervalId);
      if (isLast) model.setIsRunning(false);
    }, runTime)
  };

  return {
    wheels:            model.wheels,
    onIsRunningChange: model.onIsRunningChange,
    startEngine,
  }
};