import { FocusRing }      from "../focusRing.js";
import { ArrayIterator }  from "../../iterator/iterator.js";
import { Observable }     from "../../../../../docs/src/kolibri/observable.js"

export { Controller, ROTATION_SPEED }

const ROTATION_SPEED = 100;


const slotChars = ["&#9917;",  "&#127866;", "&#127921;", "&#127922;", "&#127891;"];

const Model = slotChars => {
  const isRunning = Observable(false);

  const shuffle = array =>
      array.map(el => ({el, sort: Math.random()}))
          .sort((a, b) => a.sort - b.sort)
          .map(el => el.el);

  const wheels = [
    FocusRing(ArrayIterator(shuffle(slotChars))),
    FocusRing(ArrayIterator(shuffle(slotChars))),
    FocusRing(ArrayIterator(shuffle(slotChars))),
  ].map(Observable);

  return {
    wheels:            wheels.map(w => ({ getValue: w.getValue, setValue: w.setValue, onChange: w.onChange })),
    isRunning:         isRunning.getValue,
    setIsRunning:      isRunning.setValue,
    onIsRunningChange: isRunning.onChange,
  };
};

const Controller = () => {
  const model = Model(slotChars);

  const startEngine = () => {
    if(model.isRunning()) return;
    model.setIsRunning(true);
    let runTime = 200 + Math.random() * 1000;
    model.wheels.map( obs =>
        setInterval(() => obs.setValue(obs.getValue().right()), ROTATION_SPEED))
        .forEach((id, idx) => {
          runTime += 500 + Math.random() * 300;
          setTimeout( () => {
            clearInterval(id);
            if(idx === model.wheels.length -1) model.setIsRunning(false);
          }, runTime)
        });
  };

  return {
    wheels: model.wheels,
    startEngine,
    onIsRunningChange: model.onIsRunningChange,
  }
};

