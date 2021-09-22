import { registerNotificationProjector } from '../../subprojectors/notificationProjector.js'

export { initNotificationElements }

const initNotificationElements = (register, emailInputElement) => {

  const emailValidityNotificiation = registerNotificationProjector(
    register, 
    { 
      onNotificationChange: register.onEmailValidNotificationChanged, 
      getNotification:      register.getEmailValidNotification 
    }
  )

  const passwordStrengthNotification = registerNotificationProjector(
    register, 
    { 
      onNotificationChange: register.onPwStrengthNotificationChanged, 
      getNotification:      register.getPwStrengthNotification 
    }
  )

  const confirmPwMatchNotification = registerNotificationProjector(
    register, 
    { 
      onNotificationChange: register.onConfirmPwMatchNotificationChanged, 
      getNotification:      register.getConfirmPwMatchNotification
    }
  )

  setupEmailValidityNotification(register, emailInputElement)

  setupPasswordStrengthNotification(register)

  setupConfirmPwMatchNotification(register, confirmPwMatchNotification)

  return {
    emailValidityNotificiation,
    passwordStrengthNotification,
    confirmPwMatchNotification
  }
}

const setupEmailValidityNotification = (register, emailInputElement) => {
  emailInputElement.onchange = () => {
    if(!register.getEmail()) return register.setEmailValidNotification('')
    !register.getEmailValidity()
      ? register.setEmailValidNotification('Malformed Email')
      : register.setEmailValidNotification('')
  }

  register.onEmailValidityChanged( valid => {
    if(valid) return register.setEmailValidNotification('')
  })
}

const setupPasswordStrengthNotification = register => {
  register.onPasswordChanged(() => {
    const pwStrength = register.getPwStrength()
    const notificationMessage = pwStrength === 0
      ? 'Hint: Type the strongest password you can'
      : pwStrength < 5
        ? `Missing ${5-pwStrength} more criteria`
        : pwStrength === 5
          ? 'Add a personal touch for stronger password'
          : "You're password is now strong enough!"

    register.setPwStrengthNotification(notificationMessage)
  })
}

const setupConfirmPwMatchNotification = (register, confirmPwMatchNotification) => {
  register.onConfirmPasswordChanged( () => {
    if(!register.getConfirmPassword()) return register.setConfirmPwMatchNotification('')

    if (register.getConfirmPassword() === register.getPassword()) {
      register.setConfirmPwMatchNotification('Passwords match!')
      toggleColor(confirmPwMatchNotification, true)
    } else if (register.getPassword().startsWith(register.getConfirmPassword())) {
      register.setConfirmPwMatchNotification("You're on a good way!")
      toggleColor(confirmPwMatchNotification, null)
    } else {
      register.setConfirmPwMatchNotification("oops! There seems to be a typo")
      toggleColor(confirmPwMatchNotification, false)
    }
  })
}