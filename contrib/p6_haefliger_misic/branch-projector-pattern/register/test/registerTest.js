import { RegisterView, RegisterController } from '../register.js'
import { fireEvent } from '../../test/testUtils/events.js'
import { Suite } from "../../test/test.js"



// Setup context
const registerSuite = Suite('register')

const setUpRegisterContext = (withContainer = false) => {
  const registerContainer = document.createElement('div')
  const strengthLinesContainer = document.createElement("div")
  const criteriaContainer = document.createElement("div")

  strengthLinesContainer.classList.add("strength-lines")
  criteriaContainer.classList.add("pw-criteria")

  registerContainer.appendChild(strengthLinesContainer)
  registerContainer.appendChild(criteriaContainer)

  const registerController = RegisterController()

  RegisterView(registerController, registerContainer)

  const Register = registerController.addRegister()

  return withContainer ? [Register, registerContainer] : Register
}

// Tests
registerSuite.add('Email input gets validated correctly', assert => {

  const Register = setUpRegisterContext()

  Register.setEmail('valid@mail.com')

  assert.is(Register.getEmail(), 'valid@mail.com')
  assert.true(Register.getEmailValidity())

  Register.setEmail('invalidMail.com')

  assert.is(Register.getEmail(), 'invalidMail.com')
  assert.true(!Register.getEmailValidity())
})

registerSuite.add("Password input gets validated correctly", assert => {
  
  const [Register, registerContainer] = setUpRegisterContext(true)

  Register.setPassword("P4$$word")

  assert.is(Register.getPassword(), "P4$$word")

  const criteria = registerContainer.querySelectorAll('.green')

  assert.is(criteria.length, 5)
  criteria.forEach(criterion => {
    assert.true(criterion.classList.contains("green"))
  })

  assert.true(Register.getPasswordValidity())
})

registerSuite.add("Correct Email notification gets displayed when email is invalid", assert => {
  const [Register, registerContainer] = setUpRegisterContext(true)
  
  Register.setEmail('invalidMail.com')
  const emailInputField = registerContainer.querySelector('#email')

  fireEvent(emailInputField, 'change')

  assert.is(Register.getEmailValidNotification(), "Malformed Email")

  Register.setEmail('valid@mail.com')

  fireEvent(emailInputField, 'change')

  assert.is(Register.getEmailValidNotification(), "")
})

registerSuite.add("Password is not valid if criterion is not met", assert => {
  
  const [Register, registerContainer] = setUpRegisterContext(true)


  // lowercase test
  Register.setPassword("P4$$WORD")

  const lowercaseCriteria = registerContainer.querySelector('.lowercase')
  
  assert.true(lowercaseCriteria.classList.contains("red"))
  assert.true(!Register.getPasswordValidity())


  // uppercase test
  Register.setPassword("p4$$word")

  const uppercaseCriteria = registerContainer.querySelector('.uppercase')
  
  assert.true(uppercaseCriteria.classList.contains("red"))
  assert.true(!Register.getPasswordValidity())


  // number test
  Register.setPassword("Pa$$word")

  const numberCriteria = registerContainer.querySelector('.number')
    
  assert.true(numberCriteria.classList.contains("red"))
  assert.true(!Register.getPasswordValidity())


  // Symbols test
  Register.setPassword("Password")

  const symbolCriteria = registerContainer.querySelector('.symbols')
    
  assert.true(symbolCriteria.classList.contains("red"))
  assert.true(!Register.getPasswordValidity())


  // 6 Characters Test
  Register.setPassword("passw")

  const sixCharCriteria = registerContainer.getElementsByClassName('6characters')[0]

  assert.true(sixCharCriteria.classList.contains("red"))
  assert.true(!Register.getPasswordValidity())
})


registerSuite.add("Correct notification gets displayed when password and confirm password are the same", assert => {
  
  const Register = setUpRegisterContext()

  Register.setPassword("P4$$word")
  Register.setConfirmPassword("P4$$word")
  
  assert.true(Register.getConfirmPwMatchNotification(), 'Passwords match')
})



registerSuite.add("Correct notification gets displayed when password and confirm password are NOT the same", assert => {
  
  const Register = setUpRegisterContext()

  Register.setPassword("P4$$word")
  Register.setConfirmPassword("P4$$wo")
  
  assert.true(Register.getConfirmPwMatchNotification(), 'oops! There seems to be a typo')
})



registerSuite.add("Correct notification gets displayed when password and confirm password are almost the same", assert => {
  
  const Register = setUpRegisterContext()

  Register.setPassword("P4$$word")
  Register.setConfirmPassword("P4$$w")

  assert.true(Register.getConfirmPwMatchNotification(), "You're on a good way")
})



registerSuite.add('Form becomes valid when email and password is valid', assert => { 

  const Register = setUpRegisterContext()

  Register.setEmail('example@mail.com')
  Register.setPassword('P4$$word')

  assert.is(Register.getEmail(), 'example@mail.com')
  assert.is(Register.getPassword(), 'P4$$word')
  assert.true(Register.getFormValidity())
})



registerSuite.add('Form becomes invalid when email is valid but password is invalid', assert => {

  const Register = setUpRegisterContext()

  Register.setEmail('example@mail.com')
  Register.setPassword('Password')

  assert.is(Register.getEmail(), 'example@mail.com')
  assert.is(Register.getPassword(), 'Password')
  assert.true(!Register.getFormValidity())
})


registerSuite.add('Form becomes invalid when email and password is invalid', assert => {

  const Register = setUpRegisterContext()

  Register.setEmail('invalidmail.com')
  Register.setPassword('Password')

  assert.is(Register.getEmail(), 'invalidmail.com')
  assert.is(Register.getPassword(), 'Password')
  assert.true(!Register.getFormValidity())
})




registerSuite.add("Show buttons toggle password input type", assert => {
  const [Register, registerContainer] = setUpRegisterContext(true)

  // first Show Button
  const firstShowButton = registerContainer.querySelectorAll('input[type="button"]')[0]

  firstShowButton.click()

  assert.is(Register.getShowPw(), true)

  assert.true(Register.getShowPw())

  firstShowButton.click()

  assert.is(Register.getShowPw(), false)
  assert.true(!Register.getShowPw())

  // second Show Button
  const secondShowButton = registerContainer.querySelectorAll('input[type="button"]')[1]

  secondShowButton.click()

  assert.is(Register.getShowPw(), true)

  secondShowButton.click()

  assert.is(Register.getShowPw(), false)
})



registerSuite.add("PaswordStrength changes when password get changed ", assert => {
  const Register = setUpRegisterContext()

  let pwStrength = Register.getPwStrength()

  assert.is(pwStrength, 0)


  Register.setPassword("A")
  pwStrength = Register.getPwStrength()
  assert.is(pwStrength, 1)

  Register.setPassword("Aa")
  pwStrength = Register.getPwStrength()
  assert.is(pwStrength, 2)

  Register.setPassword("Aa5")
  pwStrength = Register.getPwStrength()
  assert.is(pwStrength, 3)

  Register.setPassword("Aa5$")
  pwStrength = Register.getPwStrength()
  assert.is(pwStrength, 4)

  Register.setPassword("P4$$wo")
  pwStrength = Register.getPwStrength()
  assert.is(pwStrength, 5)
})


registerSuite.run()
