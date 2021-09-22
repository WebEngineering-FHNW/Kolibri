import { RegisterController, RegisterView } from './register.js'

const registerController = RegisterController()

const rootElement = document.getElementById('register')

RegisterView(registerController, rootElement)

registerController.addRegister()