
export { setupEmailValidNotification }

/**
 * Checks whether the email is valid or not. Notification gets only updated when the input field loses focus.
 * @param {object} login - Holds all attributes of the login model
 * @param {HTMLElement} notificationElement - A paragraph HTMLElement which contains messages for the user
 * @param {HTMLElement} emailInputElement - The email input Element which is being validated whenever its changed
 */
const setupEmailValidNotification = (login, notificationElement, emailInputElement ) => {
  emailInputElement.addEventListener('change', () => {

    if(!login.getEmail()) return notificationElement.innerHTML = ''
  
    login.getEmailValidity() 
      ? notificationElement.innerHTML = ''
      : notificationElement.innerHTML = 'Malformed Email'
  })
}
