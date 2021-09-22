import { LoginController, LoginView } from './login.js'
import { loginService } from './services/loginServiceDev.js'

const service = loginService()

const loginController = LoginController(service)

LoginView(loginController, document.getElementById('login'))

loginController.addLogin()