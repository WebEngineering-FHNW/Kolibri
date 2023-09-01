import { dom }            from "../../../../../docs/src/kolibri/util/dom.js";
import { ROTATION_SPEED } from "./slotMachine.js";

export { SlotMachineView, ResultView }

/**
 * Draws the parent containers of the slot machine to the user interface.
 * The lever and wheels are drawn into these containers.
 *
 * @param { HTMLElement }               rootElement
 * @param { SlotMachineControllerType } controller
 */
const SlotMachineView = (rootElement, controller) => {

  const [wheelsElement, leverElement] = dom(`
      <div id="wheels"></div>
      <div id="lever-boundary"></div>
  `);

  rootElement.append(wheelsElement, leverElement);

  const renderWheel = wheel =>
    wheelProjector(wheelsElement, wheel);

  controller.wheels.forEach(renderWheel);
  leverProjector(leverElement, controller);
};

/**
 * Shows the current result of the slot machine on the user interface.
 *
 * @param { HTMLElement }               rootElement
 * @param { SlotMachineControllerType } controller
 */
const ResultView = (rootElement, controller) => {

  const focus = [];

  const [text, result] = dom(`
    <span>Result is: </span>
    <span></span>
  `);

  const render = idx => focusRing => {
    focus[idx] = focusRing.focus();
    result.innerHTML = focus.join(" ");
  };

  controller.wheels.forEach((wheel, idx) => wheel.onChange(render(idx)));
  rootElement.append(text, result);
};

/**
 * Draws the wheels to the UI. Each slot of the wheel is represented by a value of the {@link FocusRingType focusring}.
 *
 * @param { HTMLElement }                rootElement
 * @param { IObservable<FocusRingType> } wheelObservable
 */
const wheelProjector = (rootElement, wheelObservable) => {
  const wheel           = wheelObservable.getValue();
  const [wheelElement]  = dom(`<div class="scrollWheel"></div>`);

  const createSlot = content =>
    dom(`<div class="slot">${content}</div>`)[0];

  const initialSlots = [
    wheel.right()             .focus(),
    wheel                     .focus(), // onChange later on will cause the wheel to turn once, this element will be in the middle then.
    wheel.left()              .focus(),
    wheel.left().left()       .focus(),
    wheel.left().left().left().focus()
  ].map(createSlot);

  wheelElement.append(...initialSlots);

  wheelObservable.onChange( focusRing => {
    const newSlot = createSlot(focusRing.right().right().focus());
    wheelElement.prepend(newSlot);

    let offset = 0;
    for (const child of wheelElement.children) {
      child.style.top        = offset + "px";
      child.style.transition = `all ${ROTATION_SPEED}ms linear`;
      offset                += 50;
    }

    wheelElement.removeChild(wheelElement.children[wheelElement.children.length -1]);
  });
  rootElement.append(wheelElement)
};

/**
 * Draws a lever to the user interface which allows to start the slot machine.
 *
 * @param { HTMLElement }               rootElement
 * @param { SlotMachineControllerType } controller
 */
const leverProjector = (rootElement, controller) => {

  const [knob, leverUp, leverDown] = dom(`
    <div id="knob"></div>
    <div id="leverUp"></div> <!--goes from top to middle-->
    <div id="leverDown"></div> <!--goes from middle to bottom-->
  `);

  rootElement.append(leverUp, leverDown, knob);

  const LEVER_HEIGHT    = leverUp.getBoundingClientRect().height;
  const KNOB_RADIUS     = knob.getBoundingClientRect().height / 2;
  const LEVER_MIDDLE_Y  = leverUp.getBoundingClientRect().bottom;

  let knobIsPulled      = false;
  let activated         = false;
  let dy                = 0;
  let initialKnobState  = 0;

  document.addEventListener('mousemove', evt => {
    if (knobIsPulled) {
      dy = evt.clientY - initialKnobState;
      if (2 * LEVER_HEIGHT > dy && 0 < dy) knob.style.top = `${dy}px`;

      if (evt.clientY < LEVER_MIDDLE_Y) {
        // mouse moves above the turning point
        leverUp.style.visibility    = "visible";
        leverDown.style.visibility  = "hidden";
        if (0 < dy) { // only adjust lever size when moving downwards
          leverUp.style.top         = `${dy + KNOB_RADIUS}px`;
          leverUp.style.height      = `${LEVER_HEIGHT - dy}px`;
        }
      } else {
        // mouse moves below the turning point
        leverUp.style.visibility    = "hidden";
        leverDown.style.visibility  = "visible";
        if(2 * LEVER_HEIGHT < dy) { // only activate if lever was pulled all down to the bottom
          activated = true;
        } else {
          leverDown.style.height    = `${dy - LEVER_HEIGHT}px`;
        }
      }
    }
  });

  knob.addEventListener('mousedown', evt => {
    if (!knobIsPulled) {
      initialKnobState  = evt.clientY;
      knob.style.top    = "";
      knobIsPulled      = true;
    }
  });

  document.addEventListener('mouseup', _evt => {
    // lever jumps back to the initial position
    knob.style.top              = "";
    leverUp.style.top           = "";
    leverUp.style.height        = `${LEVER_HEIGHT}px`;
    leverUp.style.visibility    = "visible";
    leverDown.style.visibility  = "hidden";
    if (activated) {
      controller.startEngine();
      activated = false;
    }
    knobIsPulled = false;
  });
};

