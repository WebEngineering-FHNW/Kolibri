/**
 * @module projector/projectorUtils
 * Helper functions for use in projectors.
 */
export { timeStringToMinutes, totalMinutesToTimeString }

/**
 * Helper function to convert time from string representation into number (minutes since midnight).
 * If the string cannot be parsed, 00:00 is assumed.
 * @pure
 * @param  { !String } timeString - format "hh:mm"
 * @return { Number }
 */
const timeStringToMinutes = timeString => {
    if( ! /\d\d:\d\d/.test(timeString)) return 0 ; // if we cannot parse the string to a time, assume 00:00
    const [hour, minute]  = timeString.split(":").map(Number);
    return hour * 60 + minute;
};

/**
 * Helper function to convert time from number (minutes since midnight) representation to "hh:mm" string.
 * @pure
 * @param  { !Number } totalMinutes
 * @return { String } - format "hh:mm"
 */
const totalMinutesToTimeString = totalMinutes => {
    const hour   = (totalMinutes / 60) | 0; // div
    const minute = totalMinutes % 60;
    return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
};
