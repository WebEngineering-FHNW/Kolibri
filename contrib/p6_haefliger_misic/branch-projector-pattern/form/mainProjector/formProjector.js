import { VALID, VALUE, LABEL, EDITABLE } from '../../presentationModel/presentationModel.js'

export { formProjector }

const className = 'formContent'

const bindInput = (attribute, inputElement) => {

  inputElement.oninput = () => attribute.getObs(VALUE).setValue(inputElement.value)

  attribute.getObs(VALUE).onChange( input => inputElement.value = input)

  attribute.getObs(VALID).onChange(
    valid => valid
      ? inputElement.classList.add(VALID)
      : inputElement.classList.remove(VALID)
  )

  attribute.getObs(EDITABLE, true).onChange(
    isEditable => isEditable
      ? inputElement.readOnly = false
      : inputElement.readOnly = true
  )

  attribute.getObs(LABEL).onChange(label => inputElement.title = label)
}

const formProjector = (formController, rootElement, form, attributes) => {

  const formElement = document.createElement('form')
  formElement.innerHTML = `
    <div class=${className}></div>
  `

  const formContentElement = formElement.querySelector('.' + className)

  attributes.forEach(attribute => {

    if(attribute.subtitle) {
      const pElement = document.createElement('p')
      pElement.innerHTML = attribute.subtitle
      pElement.classList.add('subtitle')
      formContentElement.appendChild(pElement)
    }

    const labelElement = document.createElement('label')
    labelElement.htmlFor = attribute.id
    
    const inputElement = document.createElement('input')
    inputElement.type = attribute.type
    inputElement.id = attribute.id
    inputElement.name = attribute.name
    inputElement.placeholder = attribute.placeholder 
      ? attribute.placeholder 
      : ''

    bindInput(form[attribute.id], inputElement)

    form[attribute.id].getObs(LABEL).onChange(label => labelElement.textContent = label)

    formContentElement.appendChild(labelElement)
    formContentElement.appendChild(inputElement)

    if(attribute.description) {
      const pElement = document.createElement('p')
      pElement.innerHTML = attribute.description
      pElement.classList.add('description')
      formContentElement.appendChild(pElement)
    }
    
    formContentElement.appendChild(document.createElement('br'))
  })

  rootElement.appendChild(formElement)
}