import { ListController, SelectionController }           from "./personController.js";
import { MasterView, DetailView, Person, selectionMold } from './person.js';

import {pageCss}                                         from "./instantUpdateProjector.js";

const listController      = ListController(Person);
const selectionController = SelectionController(selectionMold);

// create the sub-views, incl. binding

MasterView(listController, selectionController, document.getElementById('masterContainer'));

const detailForm = DetailView(selectionController, document.getElementById('detailCard'));
document.getElementById('detailContainer').append(...detailForm);

document.querySelector("head style").textContent += pageCss;
// binding of the main view

document.getElementById('plus').onclick    = _ => listController.addModel();
