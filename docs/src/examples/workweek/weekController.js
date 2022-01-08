import {Attribute, VALUE} from "../../kolibri/presentationModel.js";
import "../../kolibri/util/array.js"

export { WeekController }

/**
 * A presentation model for a work week that captures all information that the controller needs on top of
 * what he can delegate to other controllers. In this case there is only the total number of minutes that
 * derives from the total times of each day.
 * Using an extra presentation model to only capture one attribute is a bit over-engineered. We do it anyway
 * to show the canonical structure of controllers that encapsulate a presentation model.
 * @private
 * @pure
 * @return {{total: AttributeType<Number>}} - an object that contains the total working minutes this week
 * @constructor
 */
const WeekModel = () => {
    /** @type AttributeType<Number> */ const total = Attribute(0); // total minutes in this week
    return { total };
};

/**
 * @typedef WeekControllerType
 * @property { (dayController: !DayControllerType )       => void } addDayController
 * @property { (callback: !onValueChangeCallback<Number>) => void } onTotalWeekMinutesChanged
 */

/**
 * Creating a week controller that can capture and arbitrary number of day controllers.
 * @pure
 * @return { WeekControllerType }
 * @constructor
 */
const WeekController = () => {
    const { total } = WeekModel();
    const dayControllers = [];

    const sumOfDayTotals = () => dayControllers.sum(it => it.getTotal());
    const updateWeekTotal = _ => total.setConvertedValue(sumOfDayTotals());

    const addDayController = dayController => {
        dayControllers.push(dayController);
        dayController.onTotalChanged(updateWeekTotal);
    }

    return {
        addDayController,
        onTotalWeekMinutesChanged : total.getObs(VALUE).onChange
    }
};
