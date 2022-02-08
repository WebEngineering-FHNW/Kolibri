
export { loginEmailProjector }

/**
 * Generates an input element of type email and a label element. Additionally binds various values to the attribute and adds/removes css classes.
 * @param {object} login - Holds all attributes of the login model
 * @param {string} label - Describes what the label of the input element should be
 * @returns {HTMLElement[labelElement, inputElement]} - Returns both the input and label element in an array
 */
 const loginEmailProjector = (login, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'email'
  inputElement.id   = label.toLowerCase()
  inputElement.placeholder = 'example@mail.com'

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label
  
  inputElement.onchange = () => login.setEmail(inputElement.value)

  inputElement.addEventListener('change', () => {

    if(login.getEmailValidity()){
      inputElement.classList.add('valid')
      inputElement.classList.remove('invalid')
    } else {
      inputElement.classList.remove('valid')
      inputElement.classList.add('invalid')
    }

    // Reset classes when input field is empty
    if(!login.getEmail()) {
      inputElement.classList.remove('valid')
      inputElement.classList.remove('invalid')
    }
  })

  login.onEmailChanged( () => inputElement.value = login.getEmail() )

  return [ inputElement, labelElement ]
}