import { ObservableList } from "../observable/observable.js"
import { Attribute, VALID, VALUE, VISIBILITY } from "../presentationModel/presentationModel.js"
import { loginProjector } from "./mainProjector/loginProjector.js"

export { LoginController, LoginView }


/**
 * The Login Controller, which encapsulates the Model
 * @typedef {function(service): object} LoginController
 * @returns {{
 *  onLoginAdd: function(): number,
 *  addLogin: function(): void
 * }}
 */
const LoginController = service => {

  /**
   * Holds all the Attributes of the Login component and makes them partially externally available
   * @typedef {object} login
   * @property {Attribute} emailAttr - Emailadress
   * @property {Attribute} pwAttr - Password
   * @property {Attribute} formAttr - Indicates whether the form is valid or not
   * @property {Attribute} loginSuccessAttr - Indicates whether the login attempt was successful or not
   * @property {Attribute} notificationAttr - Notification message when the user tries to login
   * @returns {object} - Login Model
   */
  const Login = () => {
    
    const emailAttr        = Attribute('')
    const pwAttr           = Attribute('')
    const formAttr         = Attribute(false)  // Checks whether all inputs of the login form are valid
    const loginSuccessAttr = Attribute(false)  // True if a login attempt is successful
    const notificationAttr = Attribute('')     // Notification message for the user upon login attempt

    const updateFormValidity = () => {
      emailAttr.getObs(VALID).getValue() && pwAttr.getObs(VALUE).getValue()
        ? formAttr.getObs(VALID).setValue(true)
        : formAttr.getObs(VALID).setValue(false)
    }

    emailAttr.getObs(VALID).onChange( updateFormValidity )
    pwAttr   .getObs(VALUE).onChange( updateFormValidity )

    emailAttr.setValidator( input => /.+@.+\..+/.test(input) )

    return {
      getFormValidity:           formAttr.getObs(VALID).getValue,
      onFormValidityChanged:     formAttr.getObs(VALID).onChange,
      getEmail:                  emailAttr.getObs(VALUE).getValue,
      setEmail:                  emailAttr.getObs(VALUE).setValue,
      onEmailChanged:            emailAttr.getObs(VALUE).onChange,
      getEmailValidity:          emailAttr.getObs(VALID).getValue,
      onEmailValidityChanged:    emailAttr.getObs(VALID).onChange,
      getPassword:               pwAttr.getObs(VALUE).getValue,
      setPassword:               pwAttr.getObs(VALUE).setValue,
      onPasswordChanged:         pwAttr.getObs(VALUE).onChange,
      getPwVisibility:           pwAttr.getObs(VISIBILITY).getValue,
      setPwVisibility:           pwAttr.getObs(VISIBILITY).setValue,
      onPwVisibilityChanged:     pwAttr.getObs(VISIBILITY).onChange,
      onLogin:                   service.loginAttempt,
      getLoginSuccess:           loginSuccessAttr.getObs(VALID).getValue,
      setLoginSuccess:           loginSuccessAttr.getObs(VALID).setValue,
      onLoginSuccessChanged:     loginSuccessAttr.getObs(VALID).onChange,
      onNotificationChanged:     notificationAttr.getObs(VALUE).onChange,
      getNotification:           notificationAttr.getObs(VALUE).getValue,
      setNotification:           notificationAttr.getObs(VALUE).setValue,
    }
  }
  
  const loginModel = ObservableList([])

  /**
   * Adds a new login to the login model
   * @returns {object} - The login model and its externally avalaible attribute functions
   */
  const addLogin = () => {
    const newLogin = Login()
    loginModel.add(newLogin)
    return newLogin
  }

  return {
    onLoginAdd: loginModel.onAdd,
    addLogin:   addLogin,
  }

}

/**
 * Renders the login component as soon as a new login is being added
 * @param {LoginController} loginController 
 * @param {HTMLElement} rootElement - The root element which will contain the whole login component
 */
const LoginView = (loginController, rootElement) => {

  const render = login => loginProjector(loginController, rootElement, login)

  loginController.onLoginAdd(render)
}