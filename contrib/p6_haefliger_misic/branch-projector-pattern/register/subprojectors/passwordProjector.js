export { registerPasswordProjector }

const registerPasswordProjector = (register, label) => {

  const inputElement = document.createElement('input')
  inputElement.type = 'password'
  inputElement.id = label.toLowerCase()

  const labelElement = document.createElement('label')
  labelElement.htmlFor = label.toLowerCase()
  labelElement.innerHTML = label

  register.onShowPwChanged( () => {
    register.getShowPw()
      ? inputElement.type = 'text'
      : inputElement.type = 'password'
  })

  return [ inputElement, labelElement ]
}