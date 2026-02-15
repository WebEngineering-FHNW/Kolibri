import { FormController, FormView } from './formController.js'


// Setting up a form would look like this

const formController = FormController()

const firstV2RootElement = document.getElementById('formV2')

FormView(formController, firstV2RootElement)

formController.addForm()