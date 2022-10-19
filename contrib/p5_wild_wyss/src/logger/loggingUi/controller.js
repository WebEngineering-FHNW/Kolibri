export {LogUiController}

const LogUiController = model => {

  const onFilterChange = callback => {
    callback([]);
  };


  return {
    onFilterChange,

    onChangeActiveLogLevel: model.onChangeActiveLogLevel,
    setActiveLogLevel:      model.setActiveLogLevel,
    getActiveLogLevel:      model.getActiveLogLevel,

    onChangeGlobalContext:  model.onChangeGlobalContext,
    setGlobalContext:       model.setGlobalContext,
    getGlobalContext:       model.getGlobalContext,

    // addInactiveLogLevel: model.addInactiveLogLevel,
    // delInactiveLogLevel: model.delInactiveLogLevel,
    // onLogLevelChange: model.onLogLevelChange,
  }
};

