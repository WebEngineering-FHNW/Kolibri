
import { DayProjector } from "./simpleDayProjector.js"
//       the string above     ^^^^^^^^^^^^^^^^^^^^^^^   is the only thing that you need to change
//       if you want to change the projector (look and feel) for how to enter and display times of the day

// Note that in particular, controller (and thus model), business rules, and existing tests do not need to change!

import { DayController } from "./dayController.js"

// closest to the using HTML is the only place where we depend on the HTML content
const workingHoursInput = document.getElementById("workingHoursInput");

const dayController = DayController();

workingHoursInput.append(...DayProjector.projectDay(dayController)); // projector pattern

