import { dom }                       from "../../kolibri/util/dom.js";
import { totalMinutesToTimeString }  from "../../kolibri/projector/projectorUtils.js"
import { DayController }             from "../workday/dayController.js";
import { projectDay }                from "../workday/simpleDayProjector.js";

export { projectDayWithTotal, projectWeek }

/**
 * Create all the views and bindings for a week including a final row for the total.
 * @param  { !WeekControllerType } weekController
 * @return { Array<HTMLDivElement> }
 */
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
    weekController.onTotalWeekMinutesChanged( mins => totalElement.firstElementChild.textContent = totalMinutesToTimeString(mins))

    allWeekElements.push(x1, x2, x3, totalElement);
    return allWeekElements;
}

/**
 * Create the views and bindings for a day within a week with a weekday indicator in the front and
 * a total daily work time at the end.
 * @param  { !DayControllerType } dayController
 * @param  { !String } weekDay - string for the day of the week, must be unique within a week
 * @return {[HTMLDivElement,HTMLDivElement,HTMLDivElement,HTMLDivElement]} - four DIVs for weekday, am, pm, and total
 */
const projectDayWithTotal = (dayController, weekDay) => {

    const [amDiv, pmDiv]   = projectDay(dayController);
    const [weekDayElement] = dom(`<div>${weekDay}</div>`);
    const [totalElement]   = dom(`<div><output>00:00</output></div>`);

    // for consistency and a11y, make each title, name and label text unique for the weekDay
    [amDiv, pmDiv].flatMap(el => Array.from(el.querySelectorAll("input"))).forEach( input => {
        input.setAttribute("title", weekDay + " " + input.getAttribute("title"));
        input.setAttribute("name",  weekDay + "_" + input.getAttribute("name"));
    });
    [amDiv, pmDiv].flatMap(el => Array.from(el.querySelectorAll("label"))).forEach( label =>
        label.textContent = weekDay + " " + label.textContent
    );

    dayController.onTotalChanged  ( mins => totalElement.firstElementChild.textContent = totalMinutesToTimeString(mins));

    return [weekDayElement, amDiv, pmDiv, totalElement]
};
