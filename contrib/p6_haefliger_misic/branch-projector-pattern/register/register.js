import { ObservableList } from '../observable/observable.js'
import { Attribute, VALID, VALUE, VISIBILITY } from "../presentationModel/presentationModel.js"
import { registerProjector } from "./mainProjector/registerProjector.js"

export { RegisterController, RegisterView }


/**
 * The Register Controller, which encapsulates the Model
 * @typedef {function(service): object} RegisterController
 * @returns {{
 *  onRegisterAdd: function(): number,
 *  addRegister: function(): void
 * }}
 */
const RegisterController = () => {
  
  /**
   * Holds all the Attributes of the Register component and makes them partially externally available
   * @typedef {object} register
   * @property {Attribute} emailAttr - Emailadress
   * @property {Attribute} pwAttr - Password
   * @property {Attribute} confirmPwAttr - confirm Password
   * @property {Attribute} formAttr - Indicates whether the form is valid or not
   * @property {Attribute} showPwBtnAttr - Indicates whether pasword is shown or not
   * @property {Attribute} emailValidNotificationAttr - Notification that shows feedback if email is valid or not
   * @property {Attribute} confirmPwMatchNotificationAttr - Notification that notifies user whether is confirm password input matches with his password input or not
   * @property {Attribute} pwStrenghtAttr - Indicates strength of the entered password
   * @property {Attribute} patternsAttr - ALl patterns that a password has to match in order to be valid
   * @returns {object} - Register Model
   */
  const Register = () => {

    const emailAttr = Attribute('')
    const pwAttr = Attribute('')
    const confirmPwAttr = Attribute('')
    const formAttr = Attribute('')
    const showPwBtnAttr = Attribute(false)
    const emailValidNotificationAttr = Attribute('')
    const confirmPwMatchNotificationAttr = Attribute('')
    const pwStrenghtAttr = Attribute(0)
    const patternsAttr = Attribute([
      {
        name: 'lowercase',
        regex: /^(?=.*[a-z]).+$/,
        isFulfilled: false
      },
      {
        name: 'uppercase',
        regex: /^(?=.*[A-Z]).+$/,
        isFulfilled: false
      },
      {
        name: 'number',
        regex: /^(?=.*[\d]).+$/,
        isFulfilled: false
      },
      {
        name: 'symbols',
        regex: /([-+=_!@#$%^&*.,;:'\"<>/?`~\¦\°\§\´\¨\[\]\(\)\{\}\\\|\s])/,
        isFulfilled: false
      },
      {
        name: '6 characters',
        regex: /^.{6,}/,
        isFulfilled: false
      },
    ])

    const updateFormValidity = () => {
      const isValid = emailAttr.getObs(VALID).getValue() && pwAttr.getObs(VALID).getValue()
      formAttr.getObs(VALID).setValue(isValid)
    }

    emailAttr.getObs(VALID).onChange( updateFormValidity )
    pwAttr   .getObs(VALID).onChange( updateFormValidity )

    emailAttr.setValidator( input => /.+@.+\..+/.test(input) )

    pwAttr.setValidator( input => {

      // Checking the input by the patterns
      
      const setPatternsAttr = patternsAttr.getObs(VALUE).setValue

      patternsAttr.getObs(VALUE).getValue().forEach(pattern => {
        const oldPAtternsArray = patternsAttr.getObs(VALUE).getValue()

        pattern.regex.test(input)
          ? setPatternsAttr( oldPAtternsArray.map(
              patternItem => patternItem.name === pattern.name 
                ? {...pattern, isFulfilled: true} 
                : patternItem
          ))
          : setPatternsAttr( oldPAtternsArray.map(
              patternItem => patternItem.name === pattern.name 
                ? {...pattern, isFulfilled: false} 
                : patternItem
          ))
      })

      confirmPwAttr.setValidator( input => input === pwAttr.getObs(VALUE).getValue())

      const amountOfFulfilledPatterns = patternsAttr.getObs(VALUE).getValue().filter(pattern => pattern.isFulfilled).length

      pwStrenghtAttr.getObs(VALUE).setValue(amountOfFulfilledPatterns)


      return amountOfFulfilledPatterns === patternsAttr.getObs(VALUE).getValue().length
    })

    return {
      getFormValidity:                      formAttr.getObs(VALID).getValue,
      onFormValidityChanged:                formAttr.getObs(VALID).onChange,
      getEmail:                             emailAttr.getObs(VALUE).getValue,
      setEmail:                             emailAttr.getObs(VALUE).setValue,
      onEmailChanged:                       emailAttr.getObs(VALUE).onChange,
      getEmailValidity:                     emailAttr.getObs(VALID).getValue,
      onEmailValidityChanged:               emailAttr.getObs(VALID).onChange,
      getPassword:                          pwAttr.getObs(VALUE).getValue,
      setPassword:                          pwAttr.getObs(VALUE).setValue,
      onPasswordChanged:                    pwAttr.getObs(VALUE).onChange,
      getPasswordValidity:                  pwAttr.getObs(VALID).getValue,
      setPasswordValidity:                  pwAttr.getObs(VALID).setValue,
      onPasswordValidityChanged:            pwAttr.getObs(VALID).onChange,
      getConfirmPassword:                   confirmPwAttr.getObs(VALUE).getValue,
      setConfirmPassword:                   confirmPwAttr.getObs(VALUE).setValue,
      onConfirmPasswordChanged:             confirmPwAttr.getObs(VALUE).onChange,
      getShowPw:                            showPwBtnAttr.getObs(VALUE).getValue,
      setShowPw:                            showPwBtnAttr.getObs(VALUE).setValue,
      onShowPwChanged:                      showPwBtnAttr.getObs(VALUE).onChange,
      getEmailValidNotification:            emailValidNotificationAttr.getObs(VALUE).getValue,
      setEmailValidNotification:            emailValidNotificationAttr.getObs(VALUE).setValue,
      onEmailValidNotificationChanged:      emailValidNotificationAttr.getObs(VALUE).onChange,
      getConfirmPwMatchNotification:        confirmPwMatchNotificationAttr.getObs(VALUE).getValue,
      setConfirmPwMatchNotification:        confirmPwMatchNotificationAttr.getObs(VALUE).setValue,
      onConfirmPwMatchNotificationChanged:  confirmPwMatchNotificationAttr.getObs(VALUE).onChange,
      getPwStrength:                        pwStrenghtAttr.getObs(VALUE).getValue,
      setPwStrength:                        pwStrenghtAttr.getObs(VALUE).setValue,
      onPwStrengthChanged:                  pwStrenghtAttr.getObs(VALUE).onChange,
      getPatterns:                          patternsAttr.getObs(VALUE).getValue,
      setPatterns:                          patternsAttr.getObs(VALUE).setValue,
      onPatternsChanged:                    patternsAttr.getObs(VALUE).onChange,
    }  
  }

  const registerModel = ObservableList([])

  /**
   * Adds a new Register to the login model
   * @returns {object} - The register model and its externally avalaible attribute functions
   */
  const addRegister = () => {
    const newRegister = Register()
    registerModel.add(newRegister)
    return newRegister
  }

  return {
    onRegisterAdd: registerModel.onAdd,
    addRegister:   addRegister,
  }
  
}

/**
 * Renders the register component as soon as a new register is being added
 * @param {RegisterController} RegisterController 
 * @param {HTMLElement} rootElement - The root element which will contain the whole Register component
 */
const RegisterView = (RegisterController, rootElement) => {
  
  const render = register => registerProjector(RegisterController, rootElement, register)

  RegisterController.onRegisterAdd(render)
}