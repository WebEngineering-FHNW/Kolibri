import { FocusRing }      from "../focusRing.js";
import { ArrayIterator }  from "../../iterator/iterator.js";
import { dom }            from "../../../../../docs/src/kolibri/util/dom.js"
import { Observable }    from "../../../../../docs/src/kolibri/observable.js"

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

const wheelProjector = (rootElement, wheelObservable) => {

  const wheel = wheelObservable.getValue();
  const [wheelElement] = dom(`<div class="scrollWheel"></div>`);


  const createSlot = content => {
    const [el] = dom(`<div class="slot">${content}</div>`);
    return el;
  };

  const initialValues = [
    wheel.right().right().focus(),
    wheel.right().focus(),
    wheel.focus(),
    wheel.left().focus(),
    wheel.left().left().focus()
  ].map(createSlot);
  wheelElement.prepend(...initialValues);
  let counter = 0;

  for (const child of initialValues) {
    child.style.top = counter + "px";
    counter += 50;
  }

  wheelObservable.onChange( w => {
    const el = createSlot(w.right().right().focus());
    wheelElement.prepend(el);

    let counter = 0;
    for (const child of wheelElement.children) {
      child.style.top = counter + "px";
      child.style.transition = `all ${ROTATION_SPEED}ms linear`;
      counter += 50;
    }

    wheelElement.removeChild(wheelElement.children[wheelElement.children.length -1]);
  });
  rootElement.append(wheelElement)
};

const buttonProjector = (rootElement, controller) => {
  const [button] = dom(`<button>Start</button>`);
  button.onclick = controller.startEngine;
  controller.onIsRunningChange( value => button.disabled = value);

  rootElement.append(button);
};

const SlotMachineView = (rootElement, controller) => {
  const renderWheel = wheel =>
      wheelProjector(rootElement, wheel);

  controller.wheels.forEach(renderWheel);

  buttonProjector(document.getElementById("controls"), controller);
};

const slotMachineController = Controller();
SlotMachineView(document.getElementById("wheels"), slotMachineController);