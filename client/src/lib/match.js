// Turns a % mark into a level from 1 to 7
export const level = (m) =>
    m >= 80 ? 7 : m >= 70 ? 6 : m >= 60 ? 5 : m >= 50 ? 4 : m >= 40 ? 3 : m >= 30 ? 2 : m >= 1 ? 1 : 0;

// APS = best 6 subjects added up (Life Orientation left out)
export function calcAps(marks) {
    return Object.entries(marks)
    .filter(([s, m]) => s !== "Life Orientation" && m !== "" && m != null)
    .map(([, m]) => level(Number(m)))
    .sort((a, b) => b -a )
    .slice(0, 6)
    .reduce((a, b) => a + b, 0);
}

// Splits courses into "quality" and "almost" (10 marks short or less)
export function matchCourses(courses, marks) {
    const aps = calcAps(marks);
    const qualify = [], almost = [];
    courses.forEach((c) => {
        const gaps = c.requirements
        .map((r) => ({ subject: r.subject, short: r.min - Number(marks[r.subject] || 0) }))
        .filter((g) => g.short > 0);
        const apsShort = Math.max(0, c.minAps - aps);
        const total = gaps.reduce((a, g) => a + g.short, 0);
        if (!gaps.length && !apsShort) qualify.push(c);
        else if (total <= 10 && apsShort <= 3) almost.push({ ...c, gaps, apsShort });
    });
    return { aps, qualify, almost };
}

// 25000 becomes "R25 000"
export const rand = (n) => "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");