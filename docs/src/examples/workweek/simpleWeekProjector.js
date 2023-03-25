import { dom }                       from "../../kolibri/util/dom.js";
import { totalMinutesToTimeString }  from "../../kolibri/projector/projectorUtils.js"
import { DayController }             from "../workday/dayController.js";
import { DayProjector }              from "../workday/simpleDayProjector.js";

export { WeekProjector }

/**
 * @type { WeekProjectionType }
 * */
const projectWeek = weekController => {
    const allWeekElements = [];
    ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach( day => {
        const dayController = DayController();
        weekController.addDayController(dayController);
        allWeekElements.push(...projectDayWithTotal(dayController, day));
    });
    // create view
    const [x1, x2, x3, totalElement] = dom(`
        <div>Total</div> 
        <div> </div> 
        <div> </div> 
        <div><output>00:00</output></div>
    `);
    // data binding
    weekController.onTotalWeekMinutesChanged( minutes =>
        totalElement.firstElementChild.textContent = totalMinutesToTimeString(minutes)
    );

    allWeekElements.push(x1, x2, x3, totalElement);
    return allWeekElements;
};

/**
 * @type { DayWithTotalProjectionType }
 * */
const projectDayWithTotal = (dayController, weekDay) => {

    const am_pm = DayProjector.projectDay(dayController);
    /** @type HTMLDivElement */ const amDiv = am_pm[0];
    /** @type HTMLDivElement */ const pmDiv = am_pm[1];
    /** @type HTMLDivElement */ const weekDayElement = dom(`<div>${weekDay}</div>`)[0];
    /** @type HTMLDivElement */ const totalElement   = dom(`<div><output>00:00</output></div>`)[0];

    // for consistency and a11y, make each title, name and label text unique for the weekDay
    [amDiv, pmDiv].flatMap(el => Array.from(el.querySelectorAll("input"))).forEach( input => {
        input.setAttribute("title", weekDay + " " + input.getAttribute("title"));
        input.setAttribute("name",  weekDay + "_" + input.getAttribute("name"));
    });
    [amDiv, pmDiv].flatMap(el => Array.from(el.querySelectorAll("label"))).forEach( label =>
        label.textContent = weekDay + " " + label.textContent
    );

    dayController.onTotalChanged  ( minutes =>
        totalElement.firstElementChild.textContent = totalMinutesToTimeString(minutes)
    );

    return [weekDayElement, amDiv, pmDiv, totalElement]
};

/**
 * @type { IWeekProjector }
 * */
const WeekProjector = {
    projectDayWithTotal,
    projectWeek
};
