import { LoginController, LoginView } from './login.js'
import { loginService } from './services/loginService.js'

// Creates the login component in prod mode

const service = loginService()

const loginController = LoginController(service)

LoginView(loginController, document.getElementById('login'))

loginController.addLogin()