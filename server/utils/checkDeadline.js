function getTodayInSouthAfrica() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function dateToUTC(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return Date.UTC(year, month - 1, day);
}

export function checkDeadline(deadline, today = getTodayInSouthAfrica()) {
  if (!deadline) {
    return {
      deadline_status: "unknown",
      days_remaining: null,
      deadline_message: "Application deadline unavailable",
    };
  }

  const daysRemaining = Math.round(
    (dateToUTC(deadline) - dateToUTC(today)) / (1000 * 60 * 60 * 24),
  );

  if (daysRemaining < 0) {
    return {
      deadline_status: "closed",
      days_remaining: daysRemaining,
      deadline_message: "Published application deadline has passed",
    };
  }

  if (daysRemaining === 0) {
    return {
      deadline_status: "closing_soon",
      days_remaining: 0,
      deadline_message: "Application deadline is today!",
    };
  }

  if (daysRemaining <= 30) {
    return {
      deadline_status: "closing_soon",
      days_remaining: daysRemaining,
      deadline_message: `Application deadline in ${daysRemaining} days`,
    };
  }

  return {
    deadline_status: "upcoming",
    days_remaining: daysRemaining,
    deadline_message: `${daysRemaining} days until the published deadline`,
  };
}
