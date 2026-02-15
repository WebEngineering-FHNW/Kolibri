import { registerButtonProjector }  from '../subprojectors/buttonProjector.js'
import { registerTitleProjector } from '../subprojectors/titleProjector.js'
import { containerProjector } from '../../utilProjectors/containerProjector.js'

import { setupInputElements }        from './setups/setupInputElements.js'
import { setupShowButtons }          from './setups/setupShowButtons.js'
import { setupNotificationElements } from './setups/setupNotificationElements.js'
import { setupStrengthLines }        from './setups/setupStrengthLines.js'
import { setupCriteria }            from './setups/setupCriteria.js'

export { registerProjector }


/**
 * The main Projector which uses all sub projectors in this module and ties them together into a single UI
 * @param {RegisterController} registerController
 * @param {HTMLElement} rootElement - The root element which will be populated with the entire Register component
 * @param {object} register - Holds all attributes of the register model 
 */
const registerProjector = (registerController, rootElement, register) => {

  // -------------Title-------------
  const titleElement = registerTitleProjector()


  // -------------Register Button-------------
  const registerButton = registerButtonProjector(register)


  // -------------Input Elements-------------
  const {
    emailInputElement,
    emailLabelElement,
    passwordInputElement,
    passwordLabelElement,
    confirmPasswordInputElement,
    confirmPasswordLabelElement,
  } = setupInputElements(register)


  // -------------Show Password Buttons-------------
  const {
    showPasswordButton,
    showConfirmPasswordButton
  } = setupShowButtons(register, passwordInputElement, confirmPasswordInputElement)


  // -------------Notifications-------------
  const {
    emailValidityNotificiation,
    confirmPwMatchNotification
  } = setupNotificationElements(register, emailInputElement)


  // -------------Strength Lines-------------
  const strengthLinesContainer = setupStrengthLines(register, rootElement)


  // -------------Criteria-------------
  const criteriaContainer = setupCriteria(register, rootElement)


  // -------------Container Elements-------------
  const emailInputContainer = containerProjector([emailInputElement, emailValidityNotificiation], 'emailInputContainer')

  const passwordInputContainer = containerProjector([passwordInputElement, showPasswordButton], 'passwordInputContainer')

  const confirmPasswordInputContainer = containerProjector([confirmPasswordInputElement, showConfirmPasswordButton], 'confirmPasswordInputContainer')

  const confirmPasswordContainer = containerProjector([confirmPasswordInputContainer, confirmPwMatchNotification], 'confirmPasswordContainer')


  // -------------Form Element-------------
  const formElement = document.createElement('form')


  // -------------Setting up the HTML-------------
  rootElement.appendChild(titleElement)
  rootElement.appendChild(formElement)

  formElement.appendChild(emailLabelElement)
  formElement.appendChild(emailInputContainer)
  formElement.appendChild(passwordLabelElement)
  formElement.appendChild(passwordInputContainer)
  formElement.appendChild(strengthLinesContainer)
  formElement.appendChild(criteriaContainer)
  formElement.appendChild(confirmPasswordLabelElement)
  formElement.appendChild(confirmPasswordContainer)
  formElement.appendChild(registerButton)
}