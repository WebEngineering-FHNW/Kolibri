import { FirstFormController, FirstFormView } from './firstForm.js'
import { SecondFormController, SecondFormView } from './secondForm.js'


// First Form
const firstFormController = FirstFormController()

const firstRootElement = document.getElementById('form')

FirstFormView(firstFormController, firstRootElement)

firstFormController.addForm()


// Second Form
const secondFormController = SecondFormController()

const secondRootElement = document.getElementById('form2')

SecondFormView(secondFormController, secondRootElement)

secondFormController.addForm()