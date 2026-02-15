import { getAllUniqueGroupNames, VALID, VALUE, LABEL, EDITABLE } from '../../presentationModel/presentationModel.js'

export { formProjector, pageCss }

const className = 'formContent'


/**
 * This function binds an input element's value and state, such as editable and valid state, to its corresponding attribute.
 * Additionally it also binds its label to the attribute.
 * 
 * @param {Attribute}   attribute - The attribute that belongs to the input element
 * @param {HTMLElement} inputElement - An HTML input element
 * 
 * @returns {void}
 */
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


let idCounter = 0
/**
 * Generates id's which can be used for input and label pairing
 * @returns {number} - The next highest counter
 */
const nextId = () => idCounter++


/**
 * Generates an input and a label Element.
 * @param {object} attributeConfig - Can hold information that are viable for an input field, such as type, placeholder, name, etc.
 * @param {Attribute} attribute - the attribute which belongs to the input field
 * @returns {HTMLElement[labelElement, inputElement]} - Returns both the input and label element in an array
 */
const inputFieldProjector = (attributeConfig, attribute) => {

  const id = nextId()

  const labelElement   = document.createElement('label')
  labelElement.htmlFor = id

  const inputElement = document.createElement('input')
  inputElement.type  = attributeConfig.type
  inputElement.id    = id
  if(attributeConfig.name)        inputElement.name        = attributeConfig.name
  if(attributeConfig.placeholder) inputElement.placeholder = attributeConfig.placeholder

  attribute.getObs(LABEL).onChange(label => labelElement.textContent = label)

  bindInput(attribute, inputElement)

  return [labelElement, inputElement]
}


/**
 * Generates a fieldset element and appends the legend element to it
 * @param {string} legendTitle
 * @returns {HTMLElement} - The fieldset element, with the legend appended inside it
 */
const fieldsetProjector = legendTitle => {

  const fieldsetElement   = document.createElement('fieldset')

  const legendElement     = document.createElement('legend')
  legendElement.innerHTML = legendTitle

  fieldsetElement.appendChild(legendElement)

  return fieldsetElement
}


/**
 * Adds generated fieldsets for every group name to an object, with the groupName as its key and the corresponding fieldset as its value
 * @param {string[]} groupNames
 * @returns {{groupName: HTMLElement}}
 */
const setupFieldsets = groupNames => {

  const fieldsets = {}

  groupNames.forEach(groupName => {
    
    const fieldsetElement = fieldsetProjector(groupName)
    if(groupName) fieldsetElement.classList.add('group')

    fieldsets[groupName] = fieldsetElement
  })

  return fieldsets
}


/**
 * Generates a datalist with static options inside. Used for demonstrative purposes, the value for each option could have been fetched from a server in a real world application.
 * @param {string} listId - The id of the datalist, which should match the value of the list attribute of the input field it belongs to
 * @returns {HTMLElement} - The datalist with all the options appended into it
 */
const setupDatalist = listId => {

  const datalistElement = document.createElement('datalist')
  datalistElement.id = listId

  const colors = ['Yellow', 'Red', 'Orange', 'Green']

  colors.forEach(clr => {
    const optionElement = document.createElement('option')
    optionElement.value = clr
    datalistElement.appendChild(optionElement)
  })

  return datalistElement
}


/**
 * The main Projector which uses all sub projectors in this module and ties them together into a single UI
 * @param {FormController} formController
 * @param {HTMLElement} rootElement - The root element which will be populated with the entire form
 * @param {object} form - Holds all attributes of the form model
 * @param {object} attributeConfigs - Holds all information that are necessary to build the form correctly. Like the input type, name, etc.
 */
const formProjector = (formController, rootElement, form, attributeConfigs) => {

  // Set up form with a div inside it as a container around all fieldsets
  const formElement = document.createElement('form')
  formElement.innerHTML = `
    <div class=${className}></div>
  `

  // Get that div for later appendings
  const inputFiledsContainerElement = formElement.querySelector('.' + className)

  // Get all group names
  const groupNames = getAllUniqueGroupNames()

  const fieldsets = setupFieldsets(groupNames)

  // Process through all the attributes
  let submitElement // Used to make sure that the submit button always gets appended at the end of the form

  attributeConfigs.forEach(attributeConfig => {

    const attribute = form[attributeConfig.id]

    const inputContainerElement = document.createElement('div')
    inputContainerElement.classList.add('input-container')

    const [labelElement, inputElement] = inputFieldProjector(attributeConfig, attribute)

    if(attributeConfig.type === 'submit') {
      inputContainerElement.appendChild(inputElement)
    } else {
      inputContainerElement.append(labelElement, inputElement)
    }

    if(attributeConfig.id === 'favColor') {
      const listName = 'favouriteColor'
      inputElement.setAttribute('list', listName)
      const datalistElement = setupDatalist(listName)
      inputContainerElement.appendChild(datalistElement)
    }

    const groupName = attribute.getGroup()
    const fieldsetElement = fieldsets[groupName]

    if(attributeConfig.type === 'submit') submitElement = inputContainerElement

    fieldsetElement.append(inputContainerElement)
    inputFiledsContainerElement.appendChild(fieldsetElement)
  })

  inputFiledsContainerElement.appendChild(submitElement)

  rootElement.appendChild(formElement)
}


/**
 * Describes how this page should look like
 * @type {string}
 */
const pageCss = `
  h3 {
    margin-top: 2rem;
    margin-bottom: 4rem;
  }

  #formV2 {
    width: 650px;
    margin: 0 auto;
    font-family: sans-serif;
  }

  fieldset {
    border: none;
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 0.5rem;
    grid-column-gap: 1rem;
  }

  fieldset.group {
    position: relative;
    border: none;
    background: #e0e0e0;
    margin-top: 2.1rem;
  }

  legend {
    position: absolute;
    bottom: 100%;
    left: 0px;
  }

  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }

  input {
    width: 200px;
    height: 21px;
  }

  input[type="submit"] {
    margin-top: 1.5rem;
    width: 180px;
  }
`