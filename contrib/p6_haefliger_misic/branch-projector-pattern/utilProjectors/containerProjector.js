
export { containerProjector }


/**
 * Creates a div container and appends the given elements to it.
 * @param {HTMLElement[]} elements - Elements that are being nested into the container
 * @param {string} containerId - ID for the container div element
 * @returns {HTMLElement}
 */
const containerProjector = (elements, containerId) => {

  const divElement = document.createElement('div')
  divElement.id = containerId

  divElement.append(...elements)

  return divElement
}