/**
 * Create the views and bindings for a day within a week with a weekday indicator in the front and
 * a total daily work time at the end.
 * @typedef DayWithTotalProjectionType
 * @param  { !DayControllerType } dayController
 * @param  { !String }            weekDay - string for the day of the week, must be unique within a week
 * @return { [HTMLDivElement,HTMLDivElement,HTMLDivElement,HTMLDivElement] } - four DIVs for weekday, am, pm, and total
 */

/**
 * Create all the views and bindings for a work week including a final row for the total.
 * @typedef WeekProjectionType
 * @param  { !WeekControllerType   } weekController
 * @return { Array<HTMLDivElement> }
 */

/**
 * Namespace Object
 * @typedef  IWeekProjector
 * @property { DayWithTotalProjectionType }  projectDayWithTotal
 * @property { WeekProjectionType }          projectWeek
 */
