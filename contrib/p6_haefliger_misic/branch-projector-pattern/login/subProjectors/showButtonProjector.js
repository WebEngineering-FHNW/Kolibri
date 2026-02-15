
export { loginShowButtonProjector }

/**
 * Generates an input element of type button. Additionally binds various values to the attribute.
 * @param {object} login - Holds all attributes of the login model 
 * @returns {HTMLElement}
 */
 const loginShowButtonProjector = login => {

  const inputElement = document.createElement('input')
  inputElement.type = 'button'
  inputElement.classList.add('secondary')
  inputElement.innerHTML = 'show'

  inputElement.onclick = () => {
    login.setPwVisibility(!login.getPwVisibility())
  }

  login.onPwVisibilityChanged( () => inputElement.value = login.getPwVisibility() ? 'hide' : 'show')

  return inputElement
}