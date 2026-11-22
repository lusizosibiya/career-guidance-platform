import { checkDeadline } from "./checkDeadline.js";

console.log(
  "TEST 1 - Closing soon:",
  checkDeadline("2026-09-30", "2026-09-10"),
);

console.log(
  "TEST 2 - Deadline today:",
  checkDeadline("2026-09-30", "2026-09-30"),
);

console.log(
  "TEST 3 - Deadline passed:",
  checkDeadline("2026-09-30", "2026-10-01"),
);

console.log("TEST 4 - Deadline unknown:", checkDeadline(null, "2026-09-10"));
