import { LABEL } from '../../presentationModel/presentationModel.js'

export { setLabel }

/**
 * Sets the label observable value
 * @param {Attribute} attr 
 * @param {string} labelText 
 */
const setLabel = (attr, labelText) => {
  attr.getObs(LABEL).setValue(labelText)
}