import { loginEmailProjector } from '../subProjectors/emailProjector.js'
import { loginPasswordProjector } from '../subProjectors/passwordProjector.js'
import { loginShowButtonProjector } from '../subProjectors/showButtonProjector.js'
import { loginSubmitButtonProjector } from '../subProjectors/submitButtonProjector.js'
import { loginTitleProjector } from '../subProjectors/titleProjector.js'
import { containerProjector } from '../../utilProjectors/containerProjector.js'
import { loginLinkProjector } from '../subProjectors/linkProjector.js'
import { loginNotificationProjector } from '../subProjectors/notificationProjector.js'

import { setupLoginNotification } from './setups/setupLoginNotification.js'
import { setupEmailValidNotification } from './setups/setupEmailValidNotification.js'


export { loginProjector }


/**
 * The main Projector which uses all sub projectors in this module and ties them together into a single UI
 * @param {LoginController} loginController
 * @param {HTMLElement} rootElement - The root element which will be populated with the entire login component
 * @param {object} login - Holds all attributes of the login model 
 */
const loginProjector = (loginController, rootElement, login) => {

  // -------------Login Button-------------
  const loginButtonElement = loginSubmitButtonProjector(login)


  // -------------Login Title-------------
  const titleElement = loginTitleProjector()


  // -------------Input Elements-------------
  const [ emailInputElement, emailLabelElement ] = loginEmailProjector(login, 'Email')
  const [ passwordInputElement, passwordLabelElement ] = loginPasswordProjector(login, 'Password')


  // -------------Notification Elements-------------
  const emailValidNotificationElement = loginNotificationProjector()
  setupEmailValidNotification(login, emailValidNotificationElement, emailInputElement)

  const loginNotificationElement = loginNotificationProjector()
  setupLoginNotification(login, loginNotificationElement)
  loginNotificationElement.id = 'loginNotification'


  // -------------Show Button-------------
  const showButtonElement = loginShowButtonProjector(login)


  // -------------Forgot Email or Password Link-------------
  const forgotLinkElement = loginLinkProjector('Forgot email or password?')


  // -------------Container Elements-------------
  const emailInputContainer = containerProjector([emailInputElement, emailValidNotificationElement], 'emailInputContainer')

  const passwordInputContainer = containerProjector([passwordInputElement, showButtonElement], 'passwordInputContainer')


  // -------------Form Element-------------
  const formElement = document.createElement('form')


  // -------------Setting up the HTML-------------
  rootElement.appendChild(titleElement)
  rootElement.appendChild(formElement)

  formElement.appendChild(loginNotificationElement)
  formElement.appendChild(emailLabelElement)
  formElement.appendChild(emailInputContainer)
  formElement.appendChild(passwordLabelElement)
  formElement.appendChild(passwordInputContainer)
  formElement.appendChild(forgotLinkElement)
  formElement.appendChild(loginButtonElement)
}