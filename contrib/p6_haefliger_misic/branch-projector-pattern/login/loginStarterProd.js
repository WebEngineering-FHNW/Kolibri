import { LoginController, LoginView } from './login.js'
import { loginService } from './services/loginService.js'

const service = loginService()

const loginController = LoginController(service)

LoginView(loginController, document.getElementById('login'))

loginController.addLogin()