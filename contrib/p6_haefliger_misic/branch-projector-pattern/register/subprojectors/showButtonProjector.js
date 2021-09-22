export { registerShowButtonProjector }

const registerShowButtonProjector = register => {

  const buttonElement = document.createElement('button')
  buttonElement.innerHTML = 'show'

  buttonElement.addEventListener('click', () => {
    register.setShowPw(!register.getShowPw())
  })

  register.onShowPwChanged( () => buttonElement.innerHTML = register.getShowPw() ? 'hide' : 'show')

  return buttonElement
}