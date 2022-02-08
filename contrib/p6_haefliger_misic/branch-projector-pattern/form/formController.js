import { ObservableList } from '../observable/observable.js'
import { Attribute } from '../presentationModel/presentationModel.js'
import { formProjector, pageCss } from './mainProjector/formProjectorV1.js'

import { setLabel } from './utils/attrLabels.js'

export { FormController, FormView }

// insert page style
const style = document.createElement('style')
style.innerHTML = pageCss
document.head.appendChild(style)

/**
 * All configurations which are necessary for the attribute and the model, to correctly display the form
 * @type {object[]}
 */
const ALL_ATTRIBUTE_CONFIGS = [
  { id: 'firstname',  type: 'text',  placeholder: 'Placeholder' },
  { id: 'lastname',   type: 'text'   },
  { id: 'eyeColor',   type: 'color'  },
  { id: 'birthDate',  type: 'date'   },
  { id: 'date',       type: 'date'   },
  { id: 'time',       type: 'time'   },
  { id: 'number',     type: 'number' },
  { id: 'color',      type: 'color'  },
  { id: 'range',      type: 'range'  },
  { id: 'phone',      type: 'tel',   placeholder: '123-45-678'  },
  { id: 'radio1',     type: 'radio', name: 'radio-example'      },
  { id: 'radio2',     type: 'radio', name: 'radio-example'      },
  { id: 'favColor',   type: 'text',  },
  { id: 'submit',     type: 'submit' },
  { id: 'place',      type: 'text'   },
]


/**
 * The Form Controller, which encapsulates the Model
 * @typedef {function(): object} FormController
 * @returns {{
 *  onFormAdd: function(): number,
 *  addForm: function(): void
 * }}
 */
const FormController = () => {


  /**
   * The Form Model manages all information needed for the projectors, such as attribute value and validators
   * @returns {{attributeId: Attribute}}
   */
  const FormModel = () => {

    const firstNameAttr = Attribute('')
    setLabel(firstNameAttr, 'First Name')
    firstNameAttr.setGroup('Personalia')

    const lastNameAttr = Attribute('SomeLastName')
    setLabel(lastNameAttr, 'Last Name')
    lastNameAttr.setGroup('Personalia')

    const eyeClrAttr = Attribute('')
    setLabel(eyeClrAttr, 'Eye Color')
    eyeClrAttr.setGroup('Personalia')

    const birthDateAttr = Attribute('')
    setLabel(birthDateAttr, 'Date of Birth')
    birthDateAttr.setGroup('Personalia')

    const meetingDateAttr = Attribute('')
    setLabel(meetingDateAttr, 'Date')
    meetingDateAttr.setGroup('Meeting')

    const meetingTimeAttr = Attribute()
    setLabel(meetingTimeAttr, 'Time')
    meetingTimeAttr.setGroup('Meeting')

    const numberAttr = Attribute('')
    setLabel(numberAttr, 'Number')

    const colorAttr = Attribute()
    setLabel(colorAttr, 'Color')

    const rangeAttr = Attribute()
    setLabel(rangeAttr, 'Range')

    const phoneAttr = Attribute()
    setLabel(phoneAttr, 'Phone')

    const radio1Attr = Attribute('')
    setLabel(radio1Attr, 'Radio 1')

    const radio2Attr = Attribute('')
    setLabel(radio2Attr, 'Radio 2')

    const favColorAttr = Attribute('')
    setLabel(favColorAttr, 'Fav. Color')
    favColorAttr.setGroup('Meeting')

    const submitAttr = Attribute('Submit this form')
    setLabel(submitAttr, '')

    const placeAttr = Attribute('')
    setLabel(placeAttr, 'Place')
    placeAttr.setGroup('Meeting')

    numberAttr.setValidator( input => input.length >= 3 )
    phoneAttr.setValidator( input => /[0-9]{3}-[0-9]{2}-[0-9]{3}/.test(input) )

    return {
      firstname:  firstNameAttr,
      lastname:   lastNameAttr,
      eyeColor:   eyeClrAttr,
      birthDate:  birthDateAttr,
      date:       meetingDateAttr,
      time:       meetingTimeAttr,
      number:     numberAttr,
      color:      colorAttr,
      range:      rangeAttr,
      phone:      phoneAttr,
      radio1:     radio1Attr,
      radio2:     radio2Attr,
      favColor:   favColorAttr,
      submit:     submitAttr,
      place:      placeAttr,
    }
  }

  const formModel = ObservableList([])

  /**
   * Adds a new form to the form model
   * @returns {object} - The form model
   */
  const addForm = () => {
    const newForm = FormModel()
    formModel.add(newForm)
    return newForm
  }

  return {
    onFormAdd: formModel.onAdd,
    addForm:   addForm,
  }
}


/**
 * Renders the form as soon as a form is being added
 * @param {FormController} FormController 
 * @param {HTMLElement} rootElement - The root element which will contain the whole form
 */
const FormView = (FormController, rootElement) => {

  const render = form => formProjector(FormController, rootElement, form, ALL_ATTRIBUTE_CONFIGS)

  FormController.onFormAdd(render)
}