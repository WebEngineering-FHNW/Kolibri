import { registerStrengthLineProjector } from '../../subprojectors/strengthLineProjector.js'
import { containerProjector } from '../../../utilProjectors/containerProjector.js'

export { setupStrengthLines }

const BGRED    = 'line-bg-red'
const BGORANGE = 'line-bg-orange'
const BGGREEN  = 'line-bg-green'

/**
 * Grabs the amount of strengthlines needed from projector and calls helper function to bind their functionality
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} rootElement 
 * @returns {HTMLElement} - Container containing all strengthlines
 */
const setupStrengthLines = (register, rootElement) => {

  const numberOfLines = 5
  let strengthLines = Array.from('x'.repeat(numberOfLines))  // Create an array with a length of 5

  strengthLines = strengthLines.map(() => registerStrengthLineProjector()) // Fill the array with strengthlineElements

  // Get the div container from DOM and append the strengthlines box to it
  const strengthLinesContainer = rootElement.querySelector('.strength-lines')
  const strengthLinesBox = containerProjector(strengthLines, 'strengthlines-box')
  strengthLinesContainer.appendChild(strengthLinesBox)

  // Adding a placeholder for styling reasons (alignment of strengthlines to the input field)
  const placeholderElement = containerProjector([], 'placeholder')
  strengthLinesContainer.appendChild(placeholderElement)

  coloriseStrengLines(register, strengthLines)

  return strengthLinesContainer
}

/**
 * Sets the classes to each strength line element, corresponding to the password strength
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement[]} strengthLines - all html strengthlines element in an array
 * @description Used to colorise strength lines based on password strength
 */
const coloriseStrengLines = (register, strengthLines) => {
  register.onPasswordChanged( () => {
    const pwStrength = register.getPwStrength()

    resetBackgroundColors(strengthLines)

    let color = BGRED
    if(pwStrength > 1 && pwStrength < 5)  color = BGORANGE
    if(pwStrength === 5)                  color = BGGREEN;

    [...strengthLines].slice(0, pwStrength).forEach(line => line.classList.add(color))
  })
}

/**
 * Helper function which removes all classes from all strength lines
 * @param {HTMLElement[]} strengthLines
 */
const resetBackgroundColors = strengthLines => {
  [...strengthLines].forEach(line => line.classList.remove(BGRED));
  [...strengthLines].forEach(line => line.classList.remove(BGORANGE));
  [...strengthLines].forEach(line => line.classList.remove(BGGREEN))
}