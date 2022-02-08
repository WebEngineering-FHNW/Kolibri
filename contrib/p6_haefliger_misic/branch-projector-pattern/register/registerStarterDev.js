import { RegisterController, RegisterView } from './register.js'

// Creates the login component in dev mode

const registerController = RegisterController()

const rootElement = document.getElementById('register')

RegisterView(registerController, rootElement)

registerController.addRegister()