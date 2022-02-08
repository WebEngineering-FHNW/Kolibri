export { registerNotificationProjector }


/**
 * Generates a paragraph element, which will hold certain messages to notify the user on the UI
 * @param {object} register - Holds all attributes of the register model
 * @returns {HTMLElement}
 */
const registerNotificationProjector = ({ onNotificationChange, getNotification }) => {

  const pElement = document.createElement('p')

  onNotificationChange(
    () => pElement.innerHTML = getNotification()
  )

  return pElement
}