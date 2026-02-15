import { registerNotificationProjector } from '../../subprojectors/notificationProjector.js'
import { toggleColor } from '../../utils/toggleColor.js'

export { setupNotificationElements }


/**
 * Grabs all the notification elements from various projectors and binds them to their specific attributes and event listeners using additional helper functions.
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} emailInputElement - the email input element
 * @returns {{
 *  emailValidityNotificiation: HTMLElement,
 *  confirmPwMatchNotification: HTMLElement
 * }} - various notification elements
 */
const setupNotificationElements = (register, emailInputElement) => {

  const emailValidityNotificiation = registerNotificationProjector(
    { 
      onNotificationChange: register.onEmailValidNotificationChanged, 
      getNotification:      register.getEmailValidNotification 
    }
  )

  const confirmPwMatchNotification = registerNotificationProjector(
    { 
      onNotificationChange: register.onConfirmPwMatchNotificationChanged, 
      getNotification:      register.getConfirmPwMatchNotification
    }
  )

  setupEmailValidityNotification(register, emailInputElement)

  setupConfirmPwMatchNotification(register, confirmPwMatchNotification)

  return {
    emailValidityNotificiation,
    confirmPwMatchNotification
  }
}


/**
 * Checks whether the email input element is valid everytime it loses focus and sets the message to the EmailValidNotification Attribute accordingly.
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} emailInputElement - Needed in order to set the event listener
 */
const setupEmailValidityNotification = (register, emailInputElement) => {
  emailInputElement.onchange = () => {
    if(!register.getEmail()) return register.setEmailValidNotification('')
    !register.getEmailValidity()
      ? register.setEmailValidNotification('Malformed Email')
      : register.setEmailValidNotification('')
  }
}


/**
 * Updates the confirmPwMatchNotification element's classes and attributes whenever the user types in the confirm password input field.
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} confirmPwMatchNotification - The paragraph element used to notify the user whether the confirm password he typed in matches or not
 */
const setupConfirmPwMatchNotification = (register, confirmPwMatchNotification) => {
  register.onConfirmPasswordChanged( () => {
    if(!register.getConfirmPassword()) return register.setConfirmPwMatchNotification('')

    if (register.getConfirmPassword() === register.getPassword()) {
      register.setConfirmPwMatchNotification('Passwords match!')
      toggleColor(confirmPwMatchNotification, true)
    } else if (register.getPassword().startsWith(register.getConfirmPassword())) {
      register.setConfirmPwMatchNotification("You're on a good way!")
      toggleColor(confirmPwMatchNotification, null)
    } else {
      register.setConfirmPwMatchNotification("oops! There seems to be a typo")
      toggleColor(confirmPwMatchNotification, false)
    }
  })
}