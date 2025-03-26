
import { WeekProjector } from "./simpleWeekProjector.js"
//       the string above      ^^^^^^^^^^^^^^^^^^^^^^^^   is the only thing that you need to change
//       if you want to change the projector (look and feel) for how to enter and display times of the day

import { WeekController } from "./weekController.js"

// closest to the using HTML is the only place where we depend on the HTML content
const workingHoursInput = document.getElementById("workingHoursInput");

const weekController = WeekController();

workingHoursInput.append(...WeekProjector.projectWeek(weekController));
