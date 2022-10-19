export {LoggerView, LogLevelControlView, LogContextView}

const LoggerView = (rootElement, controller) => {

  const render = messages =>
    logProjector(rootElement, messages);

  controller.onFilterChange(render);
};

const LogLevelControlView = (rootElement, controller) => {

  const render = value => {
    logLevelButtonProjector(rootElement, controller, value);
  };

  controller.onChangeActiveLogLevel(render);
};

const LogContextView = (inputElement, controller) => {
  inputElement.addEventListener("input", _ =>
      controller.setGlobalContext(inputElement.value));

  const render = () => {
    globalContextProjector(inputElement, controller);
  };
};

const globalContextProjector = (inputElement, controller) => {
};


const logLevelButtonProjector = (rootElement, controller, logLevels) => {

  for (const [key, value] of Object.entries(logLevels)) {
    const el = document.getElementById(key);

    if (null === el) {
      const checkbox  = document.createElement("INPUT");
      const label     = document.createElement("LABEL");
      label.innerHTML = key;
      label.setAttribute("for", key);
      checkbox.setAttribute("id", key);
      checkbox.type = "checkbox";
      checkbox.innerHTML = key;
      checkbox.checked = value;
      rootElement.appendChild(checkbox);
      rootElement.appendChild(label)
    } else {
      el.checked = value;
    }
  }
};

const logProjector = (rootElement, messages) => {
  rootElement.innerHTML = messages;
  console.log("logProjector print Messages: " + messages);

};