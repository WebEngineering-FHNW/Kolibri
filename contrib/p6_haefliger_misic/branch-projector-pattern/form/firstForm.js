import { ObservableList } from '../observable/observable.js'
import { Attribute, LABEL, VALID, VALUE } from '../presentationModel/presentationModel.js'
import { formProjector } from './mainProjector/formProjector.js'

export { FirstFormController, FirstFormView }

const FIRST_ALL_ATTRIBUTES = [
  { id: 'firstname', type: 'text' }, 
  { id: 'date', type: 'date' }, 
  { id: 'time', type: 'time' }, 
  { id: 'number', type: 'number' }, 
  { id: 'color', type: 'color'},
  { id: 'phone', type: 'tel', placeholder: '123-45-678', description: 'Format: 123-45-678' },
]

const FirstFormController = () => {

  const Form = () => {

    const firstNameAttr = Attribute('Test Name')
    firstNameAttr.getObs(LABEL).setValue('First Name')

    const dateAttr = Attribute('2021-01-01')
    dateAttr.getObs(LABEL).setValue('Date')

    const timeAttr = Attribute('')
    timeAttr.getObs(LABEL).setValue('Time')

    const numberAttr = Attribute(12)
    numberAttr.getObs(LABEL).setValue('Number')

    const colorAttr = Attribute()
    colorAttr.getObs(LABEL).setValue('Color')

    const phoneAttr = Attribute()
    phoneAttr.getObs(LABEL).setValue('Phone')

    numberAttr.setValidator( input => input.length >= 3 )
    phoneAttr.setValidator( input => /[0-9]{3}-[0-9]{2}-[0-9]{3}/.test(input) )

    return {
      firstname:  firstNameAttr,
      date:       dateAttr,
      time:       timeAttr,
      number:     numberAttr,
      color:      colorAttr,
      phone:      phoneAttr,
    }
  }

  const formModel = ObservableList([])

  const addForm = () => {
    const newForm = Form()
    formModel.add(newForm)
    return newForm
  }

  return {
    onFormAdd: formModel.onAdd,
    addForm:   addForm,
  }
}

const FirstFormView = (FormController, rootElement) => {

  const render = form => formProjector(FormController, rootElement, form, FIRST_ALL_ATTRIBUTES)

  FormController.onFormAdd(render)
}