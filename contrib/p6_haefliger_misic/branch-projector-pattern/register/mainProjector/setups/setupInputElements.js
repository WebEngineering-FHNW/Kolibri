import { registerEmailProjector } from '../../subprojectors/emailProjector.js'
import { registerPasswordProjector } from '../../subprojectors/passwordProjector.js'

export { setupInputElements }

/**
 * Grabs all the input and label elements from various projectors and binds them to their specific attributes.
 * @param {object} register - Holds all attributes of the register model
 * @returns {{
 *  emailInputElement: HTMLElement,
 *  emailLabelElement: HTMLElement,
 *  passwordInputElement: HTMLElement,
 *  passwordLabelElement: HTMLElement,
 *  confirmPasswordInputElement: HTMLElement,
 *  confirmPasswordLabelElement: HTMLElement
 * }} - input elements with their corresponding labels
 */
const setupInputElements = register => {

  const [ 
    emailInputElement, 
    emailLabelElement 
  ] = registerEmailProjector(register, 'Email')


  const [ 
    passwordInputElement, 
    passwordLabelElement 
  ] = registerPasswordProjector(register, 'Password')

  passwordInputElement.placeholder = 'P4$$word'

  passwordInputElement.oninput = () => register.setPassword(passwordInputElement.value)

  register.onPasswordChanged( () => passwordInputElement.value = register.getPassword() )

  
  const [ 
    confirmPasswordInputElement, 
    confirmPasswordLabelElement 
  ] = registerPasswordProjector(register, 'Confirm Password (optional)')

  confirmPasswordInputElement.placeholder = 'P4$$word'

  confirmPasswordInputElement.oninput = () => register.setConfirmPassword(confirmPasswordInputElement.value)

  register.onConfirmPasswordChanged( () => confirmPasswordInputElement.value = register.getConfirmPassword() )


  return {
    emailInputElement,
    emailLabelElement,
    passwordInputElement,
    passwordLabelElement,
    confirmPasswordInputElement,
    confirmPasswordLabelElement,
  }
}
