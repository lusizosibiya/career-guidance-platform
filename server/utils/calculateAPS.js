const normalize = (subject) =>
  subject.trim().toLowerCase().replace(/\s+/g, " ");

const isEnglish = (subject) =>
  ["english home language", "english first additional language"].includes(
    normalize(subject),
  );

const isMaths = (subject) => normalize(subject) === "mathematics";

const isMathsLit = (subject) => normalize(subject) === "mathematical literacy";

const isLO = (subject) => normalize(subject) === "life orientation";

function validateSubjects(subjects) {
  if (!Array.isArray(subjects)) {
    throw new Error("Subjects must be an array");
  }

  const names = new Set();

  for (const item of subjects) {
    if (
      !item ||
      typeof item.subject !== "string" ||
      !item.subject.trim() ||
      !Number.isFinite(item.percentage) ||
      item.percentage < 0 ||
      item.percentage > 100
    ) {
      throw new Error("Invalid subject or percentage");
    }

    const name = normalize(item.subject);

    if (names.has(name)) {
      throw new Error(`Duplicate subject: ${item.subject}`);
    }

    names.add(name);
  }
}

function ukznPoints(mark) {
  if (mark >= 90) return 8;
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

function witsPoints(mark, subject) {
  if (isLO(subject)) {
    if (mark >= 90) return 4;
    if (mark >= 80) return 3;
    if (mark >= 70) return 2;
    if (mark >= 60) return 1;
    return 0;
  }

  let points = 0;

  if (mark >= 90) points = 8;
  else if (mark >= 80) points = 7;
  else if (mark >= 70) points = 6;
  else if (mark >= 60) points = 5;
  else if (mark >= 50) points = 4;
  else if (mark >= 40) points = 3;

  // Wits awards 2 bonus points for English and Maths
  // when the mark is at least 60%.
  if ((isEnglish(subject) || isMaths(subject)) && mark >= 60) {
    points += 2;
  }

  return points;
}

// WITS: best seven, including Life Orientation
export function calculateWitsAPS(subjects) {
  validateSubjects(subjects);

  const lo = subjects.find((s) => isLO(s.subject));

  if (!lo) {
    throw new Error("Life Orientation is required");
  }

  if (subjects.length < 7) {
    throw new Error("At least 7 subjects are required");
  }

  const others = subjects
    .filter((s) => !isLO(s.subject))
    .map((s) => ({
      ...s,
      points: witsPoints(s.percentage, s.subject),
    }))
    .sort((a, b) => b.points - a.points);

  const selected = [
    {
      ...lo,
      points: witsPoints(lo.percentage, lo.subject),
    },
    ...others.slice(0, 6),
  ];

  return selected.reduce((total, s) => total + s.points, 0);
}

// UKZN: English + Maths/Maths Lit + four other subjects
export function calculateUKZNAPS(subjects) {
  validateSubjects(subjects);

  const english = subjects
    .filter((s) => isEnglish(s.subject))
    .sort((a, b) => b.percentage - a.percentage)[0];

  const maths = subjects
    .filter((s) => isMaths(s.subject) || isMathsLit(s.subject))
    .sort((a, b) => b.percentage - a.percentage)[0];

  if (!english || !maths) {
    throw new Error("English and Mathematics/Maths Literacy are required");
  }

  const others = subjects
    .filter(
      (s) =>
        !isLO(s.subject) &&
        !isEnglish(s.subject) &&
        !isMaths(s.subject) &&
        !isMathsLit(s.subject),
    )
    .map((s) => ({
      ...s,
      points: ukznPoints(s.percentage),
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);

  if (others.length < 4) {
    throw new Error("UKZN APS requires 6 eligible subjects");
  }

  return (
    ukznPoints(english.percentage) +
    ukznPoints(maths.percentage) +
    others.reduce((total, s) => total + s.points, 0)
  );
}
