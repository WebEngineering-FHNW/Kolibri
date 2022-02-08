
export { registerTitleProjector }


/**
 * Generates a header 2 Element for the Register component
 * @returns {HTMLElement}
 */
const registerTitleProjector = () => {

  const h2Element = document.createElement('h2')

  h2Element.innerHTML = 'Register'

  return h2Element
}