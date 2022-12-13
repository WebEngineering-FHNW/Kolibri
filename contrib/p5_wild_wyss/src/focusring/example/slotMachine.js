import { FocusRing }      from "../focusRing.js";
import { ArrayIterator }  from "../../iterator/iterator.js";
import { dom }            from "../../../../../docs/src/kolibri/util/dom.js"
import { Observable }     from "../../../../../docs/src/kolibri/observable.js"

export { Controller, SlotMachineView }

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

const SlotMachineView = (rootElement, controller) => {

  const [wheels, lever] = dom(`
      <div id="wheels"></div>
      <div id="lever-boundary"></div>
  `);

  rootElement.append(wheels, lever);

  leverProjector(lever, controller);

  const renderWheel = wheel =>
      wheelProjector(wheels, wheel);
  controller.wheels.forEach(renderWheel);
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

const leverProjector = (rootElement, controller) => {

  const [knob, leverUp, leverDown] = dom(`
    <div id="knob"></div>
    <div id="leverUp"></div>
    <div id="leverDown"></div>
  `);

  rootElement.append(leverUp, leverDown, knob);

  const LEVER_HEIGHT = 75;
  const KNOB_RADIUS  = 15;
  const knobOffset   = knob.getBoundingClientRect().height / 2;
  const breaking     = leverUp.getBoundingClientRect().bottom;

  let pull           = false;
  let activated      = false;
  let dy             = 0;
  let mouseDown      = 0;

  document.addEventListener('mousemove', evt => {
    if (pull) {
      dy = evt.clientY - mouseDown;
      if(2 * LEVER_HEIGHT > dy && 0 < dy) knob.style.top = `${dy}px`;

      if(evt.clientY < breaking){
        // mouse moves above the turning point
        leverUp.style.visibility    = "visible";
        leverDown.style.visibility  = "hidden";
        if(0 < dy) {
          leverUp.style.top    = `${dy+ knobOffset}px`;
          leverUp.style.height = `${LEVER_HEIGHT - dy}px`;
        }
      } else {
        // mouse moves below the turning point
        leverUp.style.visibility   = "hidden";
        leverDown.style.visibility = "visible";
        if(2 * LEVER_HEIGHT - KNOB_RADIUS < dy) {
          activated = true;
        } else {
          leverDown.style.height = `${dy - LEVER_HEIGHT}px`;
        }
      }
    }
  });

  knob.addEventListener('mousedown', evt => {
    if(!pull){
      mouseDown       = evt.clientY;
      knob.style.top  = "";
      pull            = true;
    }
  });

  document.addEventListener('mouseup', _evt => {
    // lever jumps back to the initial position
    knob.style.top              = "";
    leverUp.style.top           = "";
    leverUp.style.height        = `${LEVER_HEIGHT}px`;
    leverUp.style.visibility    = "visible";
    leverDown.style.visibility  = "hidden";
    if(activated) {
      controller.startEngine();
      activated = false;
    }
    pull = false;
  });
};

