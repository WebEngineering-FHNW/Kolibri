export { toggleColor }

const RED   = 'red'
const GREEN = 'green'


/**
 * Toggles the css classes to either red or green depending on the isFulfilled parameter. If isFulfilled is null then both classes are removed
 * @param {HTMLElement} element - The element, whose color has to be toggled 
 * @param {boolean} isFulfilled
 * @returns {void}
 */
const toggleColor = (element, isFulfilled) => {
  if(isFulfilled === null) return element.classList.remove(GREEN, RED)
  if(!isFulfilled){
    element.classList.remove(GREEN)
    element.classList.add(RED)
  } else {
    element.classList.add(GREEN)
    element.classList.remove(RED)
  }
}

