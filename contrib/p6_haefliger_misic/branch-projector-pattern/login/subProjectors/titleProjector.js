
export { loginTitleProjector }


/**
 * Generates a header 2 Element for the Login component
 * @returns {HTMLElement}
 */
const loginTitleProjector = () => {

  const h2Element = document.createElement('h2')

  h2Element.innerHTML = 'Login'

  return h2Element
}