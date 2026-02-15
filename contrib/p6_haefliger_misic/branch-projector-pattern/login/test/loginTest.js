import { LoginView, LoginController } from '../login.js'
import { loginService } from '../services/loginServiceDev.js'
import { fireEvent } from '../../test/testUtils/events.js'
import { Suite } from "../../test/test.js"


// Setup context
const loginSuite = Suite('login')

const setUpLoginContext = (withContainer = false) => {
  const loginContainer = document.createElement('div')

  const service = loginService()
  const loginController = LoginController(service)

  LoginView(loginController, loginContainer)

  const Login = loginController.addLogin()

  return withContainer ? [Login, loginContainer] : Login
}


// Tests
loginSuite.add('Email input gets validated correctly', assert => {

  const Login = setUpLoginContext()

  Login.setEmail('valid@mail.com')

  assert.is(Login.getEmail(), 'valid@mail.com')
  assert.true(Login.getEmailValidity())

  Login.setEmail('invalidMail.com')

  assert.is(Login.getEmail(), 'invalidMail.com')
  assert.true(!Login.getEmailValidity())
})


loginSuite.add('Form becomes valid when email is valid and password has a value', assert => { 

  const Login = setUpLoginContext()

  Login.setEmail('example@mail.com')
  Login.setPassword('123')

  assert.is(Login.getEmail(), 'example@mail.com')
  assert.is(Login.getPassword(), '123')
  assert.true(Login.getFormValidity())
})


loginSuite.add('Form becomes invalid when email is valid but password has no value', assert => {

  const Login = setUpLoginContext()

  Login.setEmail('example@mail.com')
  Login.setPassword('')

  assert.is(Login.getEmail(), 'example@mail.com')
  assert.is(Login.getPassword(), '')
  assert.true(!Login.getFormValidity())
})


loginSuite.add('Form becomes invalid when email is invalid but password has a value', assert => {

  const Login = setUpLoginContext()

  Login.setEmail('invalidmail.com')
  Login.setPassword('123')

  assert.is(Login.getEmail(), 'invalidmail.com')
  assert.is(Login.getPassword(), '123')
  assert.true(!Login.getFormValidity())
})


loginSuite.add('Form becomes invalid when email is invalid and password has no value', assert => {

  const Login = setUpLoginContext()

  Login.setEmail('invalidmail.com')
  Login.setPassword('')

  assert.is(Login.getEmail(), 'invalidmail.com')
  assert.is(Login.getPassword(), '')
  assert.true(!Login.getFormValidity())
})


loginSuite.add('User gets notified when login attempt has failed', assert => {

  const [Login, loginContainer] = setUpLoginContext(true)

  Login.setEmail('some@mail.com')
  Login.setPassword('somePassword')


  const emailInput = loginContainer.querySelector('#email')

  fireEvent(emailInput, 'change')
  fireEvent(loginContainer.querySelector('#password'), 'input')

  const loginBtn = loginContainer.querySelector('input[type="submit"]')

  loginBtn.click()

  Login.setLoginSuccess(false)

  assert.is(Login.getEmail(), 'some@mail.com')
  assert.is(Login.getPassword(), 'somePassword')
  assert.is(Login.getNotification(), 'Sorry we could not process your login attempt')
})


loginSuite.add('User gets notified when login attempt was successful', assert => {

  const [Login, loginContainer] = setUpLoginContext(true)

  Login.setEmail('example@mail.com')
  Login.setPassword('P4$$word')

  fireEvent(loginContainer.querySelector('#email'), 'change')
  fireEvent(loginContainer.querySelector('#password'), 'input')

  const loginBtn = loginContainer.querySelector('input[type="submit"]')

  loginBtn.click()

  Login.setLoginSuccess(true)

  assert.is(Login.getEmail(), 'example@mail.com')
  assert.is(Login.getPassword(), 'P4$$word')
  assert.is(Login.getNotification(), 'Logged in successfully!')
})

loginSuite.run()
