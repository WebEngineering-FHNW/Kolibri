export { registerNotificationProjector }

const registerNotificationProjector = (register, { onNotificationChange, getNotification }) => {

  const pElement = document.createElement('p')

  onNotificationChange(
    () => pElement.innerHTML = getNotification()
  )

  return pElement
}