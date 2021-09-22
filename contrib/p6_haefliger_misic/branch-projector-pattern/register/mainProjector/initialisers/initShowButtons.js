import { registerShowButtonProjector } from '../../subprojectors/showButtonProjector.js'

export { initShowButtons }

const initShowButtons = (register, passwordInputElement, confirmPasswordInputElement) => {
  const showPasswordButton = registerShowButtonProjector(register)
  const showConfirmPasswordButton = registerShowButtonProjector(register)

  showPasswordButton.onclick = () => passwordInputElement.focus()
  showConfirmPasswordButton.onclick = () => confirmPasswordInputElement.focus()

  return {
    showPasswordButton,
    showConfirmPasswordButton
  }
}