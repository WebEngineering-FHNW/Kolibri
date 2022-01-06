import {Attribute, VALUE, VALID} from "../../kolibri/presentationModel.js";
import "../../kolibri/util/array.js"

export { WeekController }


const WeekModel = () => {
    const total = Attribute(0); // total minutes in this week
    return { total };
};

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
