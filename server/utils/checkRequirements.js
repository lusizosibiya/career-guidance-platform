function normalizeSubject(subject) {
  return subject.trim().toLowerCase().replace(/\s+/g, " ");
}

export function checkRequirements(subjects, requirements) {
  if (!Array.isArray(subjects) || !Array.isArray(requirements)) {
    throw new Error("Subjects and requirements must be arrays");
  }

  // Don't claim eligibility when requirements are missing.
  if (requirements.length === 0) {
    return {
      meetsRequirements: false,
      needsReview: true,
      missingRequirements: [],
    };
  }

  // Store learner marks for quick lookups.
  const learnerMarks = new Map(
    subjects.map(({ subject, percentage }) => [
      normalizeSubject(subject),
      percentage,
    ]),
  );

  // Group requirements by group_no.
  const groups = new Map();

  for (const requirement of requirements) {
    const groupNumber = requirement.group_no;

    if (!groups.has(groupNumber)) {
      groups.set(groupNumber, []);
    }

    groups.get(groupNumber).push(requirement);
  }

  const missingRequirements = [];

  // Each group is compulsory, but only one option
  // within a group needs to be satisfied.
  for (const [groupNumber, options] of groups) {
    const groupPassed = options.some((option) => {
      const mark = learnerMarks.get(normalizeSubject(option.subject));

      return typeof mark === "number" && mark >= option.min_percent;
    });

    if (!groupPassed) {
      missingRequirements.push({
        group_no: groupNumber,
        options: options.map((option) => ({
          subject: option.subject,
          min_percent: option.min_percent,
        })),
      });
    }
  }

  return {
    meetsRequirements: missingRequirements.length === 0,
    needsReview: false,
    missingRequirements,
  };
}
