import {FocusRing} from "../focusRing.js";
import {ArrayIterator} from "../../iterator/iterator.js";
import {Observable} from "../../../../../docs/src/kolibri/observable.js"
import {Range} from "../../range/range.js";

export { Controller, ROTATION_SPEED }

const ROTATION_SPEED = 100;
const SLOT_CHARS     = ["&#9917;", "&#127866;", "&#127866;", "&#127866;", "&#127921;", "&#127922;", "&#127891;"];

const Model = slotChars => {
  const isRunning = Observable(false);

  const shuffle = array =>
      array .map(char     => ({ char, sort: Math.random() }))
            .sort((a, b)  => a.sort - b.sort)
            .map(it       => it.char);

  const wheels = [
    ...Range(2)
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

