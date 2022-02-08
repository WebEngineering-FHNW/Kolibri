export { registerButtonProjector }

/**
 * Generates an input element of type submit. Additionally binds various values to the attribute and adds/removes css classes.
 * @param {object} register - Holds all attributes of the register model 
 * @returns {HTMLElement}
 */
const registerButtonProjector = (register) => {
  
  const inputElement = document.createElement('input')
  inputElement.type = 'submit'
  inputElement.value = 'Register'
  inputElement.classList.add('primary')

  inputElement.onclick = (event) => {
    event.preventDefault()

    // TODO: API Call auf den Server
  }

  register.onFormValidityChanged(
    valid => valid
      ? inputElement.disabled = false
      : inputElement.disabled = true
  )

  return inputElement
}