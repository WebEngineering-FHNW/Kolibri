export { registerPasswordProjector }

/**
 * Generates an input element of type password and a label element. Additionally binds various values to the attribute.
 * @param {object} register - Holds all attributes of the register model
 * @param {string} label - Describes what the label of the input element should be
 * @returns {HTMLElement[labelElement, inputElement]} - Returns both the input and label element in an array
 */
const registerPasswordProjector = (register, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'password'
  inputElement.id = label.toLowerCase()

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label


  register.onShowPwChanged( () => {
    register.getShowPw()
      ? inputElement.type = 'text'
      : inputElement.type = 'password'
  })

  return [ inputElement, labelElement ]
}