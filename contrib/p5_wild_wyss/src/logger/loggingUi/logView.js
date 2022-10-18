
const LoggerView = (rootElement, controller) => {

  logLevelButtonProjector(rootElement, controller);



  const render = messages => {

    logProjector(rootElement, messages);

  };

  controller.onFilterChange(render);

};


const logLevelButtonProjector = (rootElement, controller, loglevel) => {

  const checkbox = document.createElement("INPUT");
  checkbox.type = "checkbox";
  checkbox.onclick( _ => {
    if(checkbox.checked) {
      controller.addInactiveLogLevel()
    }
  });

  rootElement.appendChild(checkbox);
};


const logProjector = (rootElement, messages) => {

  rootElement.innerHTML = messages;
  console.log("logProjector: print Messages => " + messages);

};