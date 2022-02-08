export { registerEmailProjector }


/**
 * Generates an input element of type email and a label element. Additionally binds various values to the attribute and adds/removes css classes.
 * @param {object} register - Holds all attributes of the register model
 * @param {string} label - Describes what the label of the input element should be 
 * @returns {HTMLElement[inputElement, labelElement]} - returns both the input and label element in an array
 */
const registerEmailProjector = (register, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'email'
  inputElement.placeholder = 'example@mail.com'
  inputElement.id   = label.toLowerCase()

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label

  inputElement.oninput = () => register.setEmail(inputElement.value)

  register.onEmailChanged( () => inputElement.value = register.getEmail() )

  inputElement.addEventListener('change', () => {
    if(!register.getEmail()) return setValidityClass(inputElement, null)

    const valid = register.getEmailValidity()
    setValidityClass(inputElement, valid)
  })

  return [ inputElement, labelElement ]
}


/**
 * updates classes on an html element, according to the valid status. If valid is null, then all css classes are removed.
 * @param {HTMLElement} element - The element's class to be changed
 * @param {boolean} valid - whether the email in valid or not
 * @returns {void}
 */
const setValidityClass = (element, valid) => {

  if(null === valid) {
    element.classList.remove('valid')
    element.classList.remove('invalid')
    return
  }

  if(valid) {
    element.classList.add('valid')
    element.classList.remove('invalid')
  } else {
    element.classList.remove('valid')
    element.classList.add('invalid')
  }
}