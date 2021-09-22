import { Observable } from '../observable/observable.js'

export { Attribute, presentationModelFromAttributeNames, 
         VALID, VALUE, LABEL, EDITABLE, VISIBILITY }

const VALUE      = 'value'
const VALID      = 'valid'
const LABEL      = 'label'
const EDITABLE   = 'editable'
const VISIBILITY = 'visibility'

const presentationModelFromAttributeNames = attributeNames => {

  const result = Object.create(null)

  attributeNames.forEach(attributeName => {
    const attribute = Attribute(undefined)
    attribute.getObs(LABEL).setValue(attributeName)
    result[attributeName] = attribute
  })

  return result
}

const Attribute = value => {

  const observables = {}

  const hasObs = name => observables.hasOwnProperty(name)

  const getObs = (name, initValue = null) => 
    hasObs(name)
      ? observables[name]
      : observables[name] = Observable(initValue)

  getObs('value', value)

  let convert = id => id
  const setConverter = converter => {
    convert = converter
    setConvertedValue(value)
  }
  const setConvertedValue = val => getObs(VALUE).setValue(convert(val))

  const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

  return { getObs, hasObs, setValidator, setConverter, setConvertedValue }
}