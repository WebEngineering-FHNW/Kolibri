
export { loginPasswordProjector }

/**
 * Generates an input element of type password and a label element. Additionally binds various values to the attribute.
 * @param {object} login - Holds all attributes of the login model
 * @param {string} label - Describes what the label of the input element should be
 * @returns {HTMLElement[labelElement, inputElement]} - Returns both the input and label element in an array
 */
 const loginPasswordProjector = (login, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'password'
  inputElement.id = label.toLowerCase()
  inputElement.placeholder = 'P4$$word'

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label

  inputElement.oninput = () => login.setPassword(inputElement.value)

  login.onPasswordChanged( () => inputElement.value = login.getPassword() )

  login.onPwVisibilityChanged( () => inputElement.type = login.getPwVisibility() ? 'text' : 'password' )

  return [ inputElement, labelElement ]
}