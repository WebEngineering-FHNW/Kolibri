
export { loginSubmitButtonProjector }


/**
 * Generates an input element of type submit. Additionally binds various values to the attribute and event listeners.
 * @param {object} login - Holds all attributes of the login model
 * @returns {HTMLElement}
 */
const loginSubmitButtonProjector = login => {

  const inputElement = document.createElement('input')
  inputElement.type = 'submit'
  inputElement.value = 'Login'

  inputElement.classList.add('primary')

  inputElement.onclick = event => {
    event.preventDefault()
    
    login.onLogin(login.getEmail(), login.getPassword())
      .then(result => {
        result.token // Response should contain a token if login was successful
          ? login.setLoginSuccess(true)
          : login.setLoginSuccess(false)
      })
      .catch(err => {
        login.setLoginSuccess(false)
      })
  }

  login.onFormValidityChanged(
    valid => valid
      ? inputElement.disabled = false
      : inputElement.disabled = true
  )

  return inputElement
}