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

    getMessages:            model.getMessages,
    onMessagesChange:       model.onMessagesChange,
  }
};

