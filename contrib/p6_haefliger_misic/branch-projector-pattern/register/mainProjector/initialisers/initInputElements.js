import { registerTextProjector } from '../../subprojectors/textProjector.js'
import { registerPasswordProjector } from '../../subprojectors/passwordProjector.js'

export { initInputElements }

const initInputElements = register => {
  const [ emailInputElement, emailLabelElement ] = registerTextProjector(register, 'Email')
  const [ passwordInputElement, passwordLabelElement ] = registerPasswordProjector(register, 'Password')
  const [ confirmPasswordInputElement, confirmPasswordLabelElement ] = registerPasswordProjector(register, 'Confirm Password (optional)')

  passwordInputElement.oninput = () => register.setPassword(passwordInputElement.value)

  register.onPasswordChanged( () => passwordInputElement.value = register.getPassword() )

  register.onPasswordValidityChanged(
    valid => valid
      ? passwordInputElement.classList.add('valid')
      : passwordInputElement.classList.remove('valid')
  )

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