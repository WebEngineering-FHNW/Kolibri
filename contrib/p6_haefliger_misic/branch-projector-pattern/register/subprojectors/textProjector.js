export { registerTextProjector }

const registerTextProjector = (register, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'email'
  inputElement.id   = label.toLowerCase()

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label

  inputElement.oninput = () => register.setEmail(inputElement.value)

  register.onEmailChanged( () => inputElement.value = register.getEmail() )

  register.onEmailValidityChanged(
    valid => valid
      ? inputElement.classList.add('valid')
      : inputElement.classList.remove('valid')
  )

  return [ inputElement, labelElement ]
}