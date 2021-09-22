export { registerButtonProjector }

const registerButtonProjector = (register) => {
  
  const buttonElement = document.createElement('button')
  buttonElement.innerHTML = 'Register'

  register.onclick = () => {
    // TODO: API Call auf den Server
  }

  register.onFormValidityChanged(
    valid => valid
      ? buttonElement.classList.remove('disabled')
      : buttonElement.classList.add('disabled')
  )

  return buttonElement
}