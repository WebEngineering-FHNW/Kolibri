

const LogUiController = model => {




  const onFilterChange = callback => {
    callback([]);
  };


  return {
    onFilterChange,

    addInactiveLogLevel: model.addInactiveLogLevel,
    delInactiveLogLevel: model.delInactiveLogLevel,
    onLogLevelChange: model.onLogLevelChange,
  }
};

