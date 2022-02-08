export { registerShowButtonProjector }

/**
 * Generates an input element of type button. Additionally binds various values to the attribute.
 * @param {object} register - Holds all attributes of the register model
 * @returns {HTMLElement}
 */
const registerShowButtonProjector = register => {

  const inputElement = document.createElement('input')
  inputElement.type = 'button'
  inputElement.value = 'show'
  inputElement.classList.add('secondary')

  inputElement.addEventListener('click', () => {
    register.setShowPw(!register.getShowPw())
  })
  
  register.onShowPwChanged( () => inputElement.value = register.getShowPw() ? 'hide' : 'show')

  return inputElement
}