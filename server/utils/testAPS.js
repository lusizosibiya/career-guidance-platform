import { calculateWitsAPS, calculateUKZNAPS } from "./calculateAPS.js";

const subjects = [
  { subject: "English Home Language", percentage: 75 },
  { subject: "Mathematics", percentage: 72 },
  { subject: "Life Orientation", percentage: 85 },
  { subject: "Physical Sciences", percentage: 68 },
  { subject: "Life Sciences", percentage: 74 },
  { subject: "Geography", percentage: 80 },
  { subject: "History", percentage: 65 },
];

console.log("Wits APS:", calculateWitsAPS(subjects));
console.log("UKZN APS:", calculateUKZNAPS(subjects));
