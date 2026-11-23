import { checkRequirements } from "./checkRequirements.js";

const subjects = [
  { subject: "English Home Language", percentage: 75 },
  { subject: "Mathematics", percentage: 72 },
  { subject: "Life Orientation", percentage: 85 },
  { subject: "Physical Sciences", percentage: 68 },
  { subject: "Life Sciences", percentage: 74 },
  { subject: "Geography", percentage: 80 },
  { subject: "History", percentage: 65 },
];

const requirements = [
  {
    subject: "English Home Language",
    min_percent: 60,
    group_no: 1,
  },
  {
    subject: "English First Additional Language",
    min_percent: 60,
    group_no: 1,
  },
  {
    subject: "Mathematics",
    min_percent: 70,
    group_no: 2,
  },
  {
    subject: "Physical Sciences",
    min_percent: 60,
    group_no: 3,
  },
];

console.log("TEST 1: Learner meets requirements");
console.log(checkRequirements(subjects, requirements));

// Now make the Mathematics requirement harder.
const harderRequirements = requirements.map((requirement) =>
  requirement.subject === "Mathematics"
    ? { ...requirement, min_percent: 80 }
    : requirement,
);

console.log("\nTEST 2: Mathematics requirement too high");
console.log(checkRequirements(subjects, harderRequirements));

console.log("\nTEST 3: No requirements available");
console.log(checkRequirements(subjects, []));
