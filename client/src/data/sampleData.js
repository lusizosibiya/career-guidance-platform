// Sample data until the backend is ready (APS values are placeholders)

export const SUBJECTS = [
  "English Home Language",
  "English First Additional Language",
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Accounting",
  "Business Studies",
  "Geography",
  "History",
  "Information Technology",
  "Life Orientation",
];

export const FIELDS = [
  "Accounting / Finance",
  "Business / Commerce",
  "Engineering",
  "Health Sciences / Nursing",
  "Humanities / Social Sciences",
  "IT / Business",
  "IT / Computer Science",
];

// Standard 7-point scale, used as the starting point for each university
const STANDARD_SCALE = [
  { min: 80, points: 7 },
  { min: 70, points: 6 },
  { min: 60, points: 5 },
  { min: 50, points: 4 },
  { min: 40, points: 3 },
  { min: 30, points: 2 },
  { min: 0, points: 1 },
];

export const institutions = [
  {
    id: "inst-1",
    name: "University of the Witwatersrand",
    type: "university",
    location: "Johannesburg",
    website: "",
    aps_rules: {
      subjects_counted: 6,
      life_orientation: "exclude",
      scale: STANDARD_SCALE,
      notes: "",
    },
  },
  {
    id: "inst-2",
    name: "University of KwaZulu-Natal",
    type: "university",
    location: "Durban",
    website: "",
    aps_rules: {
      subjects_counted: 6,
      life_orientation: "exclude",
      scale: STANDARD_SCALE,
      notes: "",
    },
  },
];

export const courses = [
  { id: "c-1", institution_id: "inst-1", name: "BSc Computer Science", fields: ["IT / Computer Science"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-2", institution_id: "inst-1", name: "BCom Accounting", fields: ["Accounting"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-3", institution_id: "inst-1", name: "Bachelor of Arts", fields: ["Humanities"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-4", institution_id: "inst-1", name: "BSc Engineering (Industrial)", fields: ["Engineering", "Logistics & Supply Chain"], qualification_type: "Degree", min_aps: 0, duration: "4 years", additional_requirements: "" },
  { id: "c-5", institution_id: "inst-1", name: "Bachelor of Nursing", fields: ["Nursing & Health"], qualification_type: "Degree", min_aps: 0, duration: "4 years", additional_requirements: "" },
  { id: "c-6", institution_id: "inst-2", name: "BSc Computer Science and Information Technology", fields: ["IT / Computer Science"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-7", institution_id: "inst-2", name: "BCom Accounting", fields: ["Accounting"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-8", institution_id: "inst-2", name: "Bachelor of Social Science", fields: ["Humanities"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
  { id: "c-9", institution_id: "inst-2", name: "BSc Engineering", fields: ["Engineering"], qualification_type: "Degree", min_aps: 0, duration: "4 years", additional_requirements: "" },
  { id: "c-10", institution_id: "inst-2", name: "Bachelor of Nursing", fields: ["Nursing & Health"], qualification_type: "Degree", min_aps: 0, duration: "4 years", additional_requirements: "" },
  { id: "c-11", institution_id: "inst-2", name: "BCom (Supply Chain Management)", fields: ["Logistics & Supply Chain"], qualification_type: "Degree", min_aps: 0, duration: "3 years", additional_requirements: "" },
];

export const careers = [
  { id: "car-1", title: "Software Developer", field: "IT / Computer Science" },
  { id: "car-2", title: "Data Analyst", field: "IT / Computer Science" },
  { id: "car-3", title: "Chartered Accountant", field: "Accounting" },
  { id: "car-4", title: "Auditor", field: "Accounting" },
  { id: "car-5", title: "Social Worker", field: "Humanities" },
  { id: "car-6", title: "Journalist", field: "Humanities" },
  { id: "car-7", title: "Industrial Engineer", field: "Engineering" },
  { id: "car-8", title: "Civil Engineer", field: "Engineering" },
  { id: "car-9", title: "Registered Nurse", field: "Nursing & Health" },
  { id: "car-10", title: "Community Health Nurse", field: "Nursing & Health" },
  { id: "car-11", title: "Supply Chain Manager", field: "Logistics & Supply Chain" },
  { id: "car-12", title: "Logistics Coordinator", field: "Logistics & Supply Chain" },
];