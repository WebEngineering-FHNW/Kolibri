import { registerShowButtonProjector } from '../../subprojectors/showButtonProjector.js'

export { setupShowButtons }

/**
 * Grabs show buttons from projector and binds specific event listeners to them
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} passwordInputElement - used to set its focus whenever the corresponding show button is clicked
 * @param {HTMLElement} confirmPasswordInputElement - used to set its focus whenever the corresponding show button is clicked
 * @returns {{
 *  showPasswordButton: HTMLElement,
 *  showConfirmPasswordButton: HTMLElement
 * }} - All show buttons in an object
 */
const setupShowButtons = (register, passwordInputElement, confirmPasswordInputElement) => {
  const showPasswordButton = registerShowButtonProjector(register)
  const showConfirmPasswordButton = registerShowButtonProjector(register)

  showPasswordButton.onclick = () => passwordInputElement.focus()
  showConfirmPasswordButton.onclick = () => confirmPasswordInputElement.focus()

  return {
    showPasswordButton,
    showConfirmPasswordButton
  }
}