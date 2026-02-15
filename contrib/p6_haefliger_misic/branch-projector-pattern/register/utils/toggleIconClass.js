
export { toggleIconClass }

const CROSS_DEFAULT = 'cross-default'
const CROSS_ERROR   = 'cross-error'
const TICK_SUCCESS  = 'tick-success'


/**
 * Assigns css classes depending on the isFulfilled parameter. If isFulfilled is null then the default state gets applied.
 * @param {HTMLElement} element - The element, whose color has to be toggled 
 * @param {boolean} isFulfilled
 * @returns {void}
 */
const toggleIconClass = (element, isFulfilled) => {
  if(isFulfilled === null) {
    element.classList.remove(CROSS_ERROR, TICK_SUCCESS)
    element.classList.add(CROSS_DEFAULT)
    return 
  }
  if(!isFulfilled){
    element.classList.remove(TICK_SUCCESS, CROSS_DEFAULT)
    element.classList.add(CROSS_ERROR)
  } else {
    element.classList.add(TICK_SUCCESS)
    element.classList.remove(CROSS_ERROR, CROSS_DEFAULT)
  }
}