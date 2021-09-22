import { ObservableList } from '../observable/observable.js'
import { Attribute, LABEL, VALID, VALUE } from '../presentationModel/presentationModel.js'
import { formProjector } from './mainProjector/formProjector.js'

export { SecondFormController, SecondFormView }

const SECOND_ALL_ATTRIBUTES = [
  { id: 'password', type: 'password' },
  { id: 'time', type: 'time' }, 
  { id: 'checkbox1', type: 'checkbox', subtitle: 'Which meal do you like?' }, // Subtitle sets a paragraph element above the input field, which can be used as an addition description.
  { id: 'checkbox2', type: 'checkbox' },
  { id: 'radio1', type: 'radio', name: 'example', subtitle: 'Choose your favourite car' }, // Radio buttons require the attribute in order to be grouped
  { id: 'radio2', type: 'radio', name: 'example' }, 
  { id: 'radio3', type: 'radio',  name: 'example' },
]

const setLabel = (attr, labelText) => {
  attr.getObs(LABEL).setValue(labelText)
}

const SecondFormController = () => {

  const Form = () => {

    const passwordAttr = Attribute('')
    setLabel(passwordAttr, 'Password')

    const checkBox1Attr = Attribute('')
    setLabel(checkBox1Attr, 'Spaghetti')
    
    const checkBox2Attr = Attribute('')
    setLabel(checkBox2Attr, 'Cordon Bleu')
    
    const timeAttr = Attribute('20:54')
    setLabel(timeAttr, 'Time')

    const radio1Attr = Attribute('')
    setLabel(radio1Attr, 'Mercedes')
    
    const radio2Attr = Attribute('')
    setLabel(radio2Attr, 'Audi')

    const radio3Attr = Attribute('')
    setLabel(radio3Attr, 'Ferrari')


    return {
      password:   passwordAttr,
      checkbox1:  checkBox1Attr,
      checkbox2:  checkBox2Attr,
      time:       timeAttr,
      radio1:     radio1Attr,
      radio2:     radio2Attr,
      radio3:     radio3Attr,
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

const SecondFormView = (FormController, rootElement) => {

  const render = form => formProjector(FormController, rootElement, form, SECOND_ALL_ATTRIBUTES)

  FormController.onFormAdd(render)
}