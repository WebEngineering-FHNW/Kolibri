import {FocusRing} from "../focusRing.js";
import {ArrayIterator} from "../../iterator/iterator.js";
import {Observable} from "../../../../../docs/src/kolibri/observable.js"
import {Range} from "../../range/range.js";

export { Controller, ROTATION_SPEED }

const ROTATION_SPEED = 100;
const SLOT_CHARS     = ["&#9917;", "&#127866;", "&#127866;", "&#127866;", "&#127921;", "&#127922;", "&#127891;"];
const WHEEL_COUNT = 3;
const Model = slotChars => {
  const isRunning = Observable(false);

  /**
   * Returns a randomly shuffled copy of the given array.
   * @template _T_
   * @param {Array<_T_>} array
   * @returns {Array<_T_>}
   */
  const shuffle = array =>
      // Math.random() returns a number between [0,1]. If the result, of the compareFn >= 0, a is first.
      [...array].sort((_a, _b) => 0.5 - Math.random());

  /** @type {Array<IObservable<FocusRingType>>} */
  const wheels = [
    ...Range(WHEEL_COUNT-1)
    .map(_ => FocusRing(ArrayIterator(shuffle(slotChars))))
    .map(Observable)
  ];

  return {
    wheels:            wheels.map(w => ({ getValue: w.getValue, setValue: w.setValue, onChange: w.onChange })),
    isRunning:         isRunning.getValue,
    setIsRunning:      isRunning.setValue,
    onIsRunningChange: isRunning.onChange,
  };
};

const Controller = () => {
  const model = Model(SLOT_CHARS);

  const startEngine = () => {
    if(model.isRunning()) return;
    model.setIsRunning(true);

    const minimalRunTime = 200 + Math.random() * 1000;

    model.wheels.map( obs =>
        setInterval(() => obs.setValue(obs.getValue().right()), ROTATION_SPEED))
        .forEach(clearIntervalAfterTimout(minimalRunTime));
  };

  const clearIntervalAfterTimout = runTime => (intervalId, idx) => {
    runTime += 500 + Math.random() * 300; // do not stop all wheels at once
    const isLast = idx === model.wheels.length - 1;
    setTimeout(() => {
      clearInterval(intervalId);
      if (isLast) model.setIsRunning(false);
    }, runTime)
  };

  return {
    wheels: model.wheels,
    startEngine,
    onIsRunningChange: model.onIsRunningChange,
  }
};

