// Fake data until the backend is ready
export const SUBJECTS = [
    "English Home Language", "Home Language (isiZulu, Sesotho, etc.)", "Mathematics",
    "Mathematical Literacy", "Physical Sciences", "Life Sciences", "Accounting",
    "Business Studies", "Geography", "Life Orientation",
];

export const initialCareers = [
    { id: 1, name: "Civil Engineering", minSalary: 25000, maxSalary: 70000 },
    { id: 2, name: "Registered Nurse", minSalary: 18000, maxSalary: 40000 },
    { id: 3, name: "Accountant", minSalary: 20000, maxSalary: 60000 },
    { id: 4, name: "Electrician", minSalary: 12000, maxSalary: 35000 },
    { id: 5, name: "Software Developer", minSalary: 22000, maxSalary: 75000 },
    { id: 6, name: "Primary School Teacher", minSalary: 16000, maxSalary: 38000 },
];

export const initialCourses = [
    {id: 1, name: "BEng Civil Engineering", institution: "University of Witwatersrand", minAps: 38,
        requirements: [{ subject: "Mathematics", min: 70}, { subject: "Physical Sciences", min: 70}, { subject: "English Home Language", min: 60}], careerIds:[1]
    },
    { id: 2, name: "BSc Nursing", institution: "University of Johannesburg", minAps: 30,
        requirements: [{ subject: "Life Sciences", min: 60}, { subject: "English Home Language", min: 60}], careerIds:[2]
    },
    { id: 3, name: "BCom Accounting", institution: "University of Johannesburg", minAps: 32,
        requirements: [{ subject: "Mathematics", min: 60}, { subject: "English Home Language", min: 60}], careerIds:[3]
    },
    { id: 4, name: "N3 Electrical Engineering", institution: "Ekurhuleni East TVET College", minAps: 0,
        requirements: [{ subject: "Mathematics", min: 40}, { subject: "Physical Sciences", min: 40}], careerIds:[4]
    },
    { id: 5, name: "Diploma in IT", institution: "Tshwane University of Technology", minAps: 24,
        requirements: [{ subject: "Mathematics", min: 50}, { subject: "English Home Language", min: 50}], careerIds:[5]
    },
    { id: 6, name: "BEd Foundation Phase", institution: "University of South Africa", minAps: 26,
        requirements: [{ subject: "English Home Language", min: 50}], careerIds:[6]
    },
];