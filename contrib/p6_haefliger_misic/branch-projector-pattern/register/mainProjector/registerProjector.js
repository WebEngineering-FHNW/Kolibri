import { registerButtonProjector }  from '../subprojectors/buttonProjector.js'

import { initInputElements }        from './initialisers/initInputElements.js'
import { initShowButtons }          from './initialisers/initShowButtons.js'
import { initNotificationElements } from './initialisers/initNotificationElements.js'
import { initStrengthLines }        from './initialisers/initStrengthLines.js'
import { initCriterias }            from './initialisers/initCriterias.js'

export { registerProjector }

const registerProjector = (registerController, rootElement, register) => {

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
  } = initInputElements(register)


  // -------------Show Password Buttons-------------
  const {
    showPasswordButton,
    showConfirmPasswordButton
  } = initShowButtons(register, passwordInputElement, confirmPasswordInputElement)


  // -------------Notifications-------------
  const {
    emailValidityNotificiation,
    passwordStrengthNotification,
    confirmPwMatchNotification
  } = initNotificationElements(register, emailInputElement)


  // -------------Strength Lines-------------
  const strengthLinesContainer = initStrengthLines(register, rootElement)


  // -------------Criterias-------------
  const criteriaContainer = initCriterias(register, rootElement)


  // -------------Setting up the HTML-------------
  rootElement.appendChild(emailLabelElement)
  rootElement.appendChild(emailInputElement)
  rootElement.appendChild(emailValidityNotificiation)
  rootElement.appendChild(document.createElement('br'))
  rootElement.appendChild(passwordLabelElement)
  rootElement.appendChild(passwordInputElement)
  rootElement.appendChild(showPasswordButton)
  rootElement.appendChild(strengthLinesContainer)
  rootElement.appendChild(passwordStrengthNotification)
  rootElement.appendChild(criteriaContainer)  
  rootElement.appendChild(document.createElement('br'))
  rootElement.appendChild(confirmPasswordLabelElement)
  rootElement.appendChild(confirmPasswordInputElement)
  rootElement.appendChild(showConfirmPasswordButton)
  rootElement.appendChild(confirmPwMatchNotification)
  rootElement.appendChild(document.createElement('br'))
  rootElement.appendChild(registerButton)
}