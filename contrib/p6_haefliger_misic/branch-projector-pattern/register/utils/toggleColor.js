export { toggleColor }

const RED   = 'red'
const GREEN = 'green'

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