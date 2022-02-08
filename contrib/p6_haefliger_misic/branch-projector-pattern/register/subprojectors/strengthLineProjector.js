export { registerStrengthLineProjector }

/**
 * Generates a div element that represents a strength line and adds the "line" css class to it
 * @returns {HTMLElement}
 */
const registerStrengthLineProjector = () => {

  const divElement = document.createElement('div')

  divElement.classList.add('line')

  return divElement
}