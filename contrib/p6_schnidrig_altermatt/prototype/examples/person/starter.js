import { ListController, SelectionController }           from "./personController.js";
import { Person, selectionMold }                         from './person.js';

import { pageCss }                                       from "./instantUpdateProjector.js";
import { projectDetailView, projectMasterView }          from "./masterDetailProjector.js";

const listController      = ListController(Person);
const selectionController = SelectionController(selectionMold);

// create the sub-views, incl. binding

const master = projectMasterView(listController, selectionController, );
document.getElementById('masterContainer').append(...master);

const detailForm = projectDetailView(selectionController, document.getElementById('detailCard'));
document.getElementById('detailContainer').append(...detailForm);

document.querySelector("head style").textContent += pageCss;
// binding of the main view

document.getElementById('plus').onclick    = _ => listController.addModel();
