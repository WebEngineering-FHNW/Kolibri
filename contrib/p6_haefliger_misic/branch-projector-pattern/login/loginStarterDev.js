import { LoginController, LoginView } from './login.js'
import { loginService } from './services/loginServiceDev.js'

// Creates the login component in dev mode

const service = loginService()

const loginController = LoginController(service)

LoginView(loginController, document.getElementById('login'))

loginController.addLogin()