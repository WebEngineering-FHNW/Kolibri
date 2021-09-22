import { fireEvent } from "./events.js"

export { setInputValue }

// Sets the value of an inputfield and fires events which typically gets fired when a user would set them
const setInputValue = ( emailInputField, emailValue ) => {
  emailInputField.value = emailValue

  fireEvent(emailInputField, 'keyup')
  fireEvent(emailInputField, 'change')
  fireEvent(emailInputField, 'focusout')
}