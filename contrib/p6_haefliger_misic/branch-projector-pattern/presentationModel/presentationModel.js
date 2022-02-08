import { Observable } from '../observable/observable.js'

export {  Attribute, presentationModelFromAttributeNames, 
          getAllUniqueGroupNames,
          VALID, VALUE, LABEL, EDITABLE, VISIBILITY }

const VALUE      = 'value'
const VALID      = 'valid'
const LABEL      = 'label'
const EDITABLE   = 'editable'
const VISIBILITY = 'visibility'


/**
 * Creates attributes from attribute names and populates them in an object (model)
 * 
 * @param {string[]} attributeNames - Contains all Attribute names
 * 
 * @returns {{attributeName: Attribute}} - One object with all attributes as values and their names as keys
 */
const presentationModelFromAttributeNames = attributeNames => {

  const result = Object.create(null)

  attributeNames.forEach(attributeName => {
    const attribute = Attribute(undefined)
    attribute.getObs(LABEL).setValue(attributeName)
    result[attributeName] = attribute
  })

  return result
}

/**
 * Holds all unique group names
 * @type {Set<string>}
 */
const allGroupNames = new Set()

/**
 * Getter function for group names
 * 
 * @returns {Set<string>} 
 */
const getAllUniqueGroupNames = () => {
  return allGroupNames
}

/**
 * Attribute - Holds observables for different cases which can be listened to and change its values.
 * 
 * @typedef {function(value): object} Attribute
 * 
 * @param {*} value - the initial value of the attribute
 * 
 * @returns {{
 *  getObs: function(name, initValue): Observable,
 *  hasObs: function(name): boolean,
 *  setValidator: function(validate): void,
 *  setConverter: function(val): void,
 *  setGroup: function(name): void,
 *  getGroup: function(): string  
 * }}
 */
const Attribute = value => {

  /**
   * Holds all observables with their names as keys and the Observable as value
   * @type {object}
   */
  const observables = {}

  /**
   * The name of the group this attribute belongs to. If it doesn't belong to a group, its groupName remains undefined
   * @type {string}
   */
  let groupName = undefined

  /**
   * Checks whether or not an observable exists by this name
   * @param {string} name - name of the observable
   * @returns {boolean}
   */
  const hasObs = name => observables.hasOwnProperty(name)

  /**
   * Returns an observable, if doen't exist yet, it creates a new observable and returns it.
   * @param {string} name - name of the observable
   * @param {*} initValue - the initial value of the observable
   * @returns {Observable}
   */
  const getObs = (name, initValue = null) => 
    hasObs(name)
      ? observables[name]
      : observables[name] = Observable(initValue)

  getObs('value', value) // To set an observable as soon as the Attribute function gets called

  
  /**
   * Adds the name to the allGroupNames Set and sets this attributes groupName
   * @param {string} name - Name of the group it should belong to
   * @returns {void}
   */
  const setGroup = name => {
    allGroupNames.add(name)
    groupName = name
  }

  /**
   * Returns the name of this attribute's group
   * @returns {string} - The name of the group this attribute belongs to
   */
  const getGroup = () => {
    return groupName
  }

  setGroup(groupName)  // To allocate this attribute to the undefined group as soon as the Attribute function gets called


  let convert = id => id
  const setConverter = converter => {
    convert = converter
    setConvertedValue(value)
  }
  const setConvertedValue = val => getObs(VALUE).setValue(convert(val))

  /**
   * Sets the callback function to the VALID observable, which then tests the input everytime the VALUE Observable gets changed
   * @param {callback} validate - A callback function which returns true if the input is valid or false if its invalid
   * @returns {void}
   */
  const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

  return { getObs, hasObs, setValidator, setConverter, setConvertedValue, setGroup, getGroup }
}