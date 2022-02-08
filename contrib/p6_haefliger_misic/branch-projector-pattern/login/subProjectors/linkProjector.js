
export { loginLinkProjector }


/**
 * Generates an anchor element
 * @param {string} linkText - Describes what the text of the link should be
 * @returns {HTMLElement} - Returns the anchor element
 */
const loginLinkProjector = linkText => {

  const aElement = document.createElement('a')

  aElement.innerHTML = linkText

  return aElement
}