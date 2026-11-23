import { Link } from "react-router-dom";
import { useMarks } from "../context/MarksContext.jsx";
import { Card } from "../components/UI.jsx";
import { useMatch } from "../lib/useMatch.js";

// These ranges are illustrative placeholders for the MVP.
// They are NOT verified South African salary statistics.
function getIllustrativeSalaryRange(careerName = "") {
  const name = careerName.toLowerCase();

  if (
    /software|developer|programmer|cybersecurity|data scientist|machine learning/.test(
      name,
    )
  ) {
    return "R20,000 – R70,000";
  }

  if (/engineer|architect/.test(name)) {
    return "R20,000 – R75,000";
  }

  if (/nurse|midwife/.test(name)) {
    return "R15,000 – R45,000";
  }

  if (/accountant|auditor|financial|banker/.test(name)) {
    return "R18,000 – R65,000";
  }

  if (/manager|consultant|analyst/.test(name)) {
    return "R18,000 – R65,000";
  }

  return "R15,000 – R55,000";
}

// Keep Andre's three matching statuses.
const SECTIONS = [
  {
    status: "eligible",
    title: "You meet the minimum requirements",
    empty: "No preliminary matches found.",
  },
  {
    status: "needs_review",
    title: "Further requirements to check",
    empty: "No courses need further review.",
  },
  {
    status: "not_eligible",
    title: "Requirements not met",
    empty: "No unsuccessful matches.",
  },
];

function Results() {
  const { marks } = useMarks();

  // Andre's hook connects to POST /api/match.
  const { data, loading, error } = useMatch(marks);

  if (!marks?.length) {
    return (
      <Card className="p-8 text-center max-w-md">
        <p className="font-bold">No marks yet</p>

        <p className="text-slate-600 text-sm mt-1">
          Enter your marks to see your results.
        </p>

        <Link
          to="/marks"
          className="inline-block mt-4 bg-[#FFC72C] text-[#14213D] font-bold px-5 py-3 rounded-lg"
        >
          Enter my marks
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">My results</h1>

        <Link to="/marks" className="text-sm font-semibold underline">
          Edit marks
        </Link>
      </div>

      {/* LOADING MESSAGE */}
      {loading && (
        <Card className="p-6">
          <p role="status" className="text-slate-600">
            Matching your marks...
          </p>
        </Card>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* RESULTS FROM THE BACKEND */}
      {data && (
        <>
          {/* APS SUMMARY */}
          <div className="bg-[#14213D] text-white rounded-xl p-5">
            <p className="text-sm text-slate-300">Your university APS scores</p>

            <div className="mt-2 grid grid-cols-2 gap-4">
              {data.aps_by_institution?.map((item) => (
                <div key={item.institution_id}>
                  <p className="text-sm text-slate-300">
                    {item.institution?.includes("Witwatersrand")
                      ? "Wits"
                      : item.institution?.includes("KwaZulu")
                        ? "UKZN"
                        : item.institution}
                  </p>

                  {item.aps != null ? (
                    <p className="text-4xl font-extrabold text-[#FFC72C]">
                      {item.aps}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-200">
                      {item.error || "APS unavailable"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-300 mt-4">
              {data.summary?.eligible ?? 0} preliminary matches
              {" · "}
              {data.summary?.needs_review ?? 0} need review
              {" · "}
              {data.summary?.not_eligible ?? 0} requirements not met
            </p>
          </div>

          <p className="text-sm text-slate-600">
            Results are preliminary and do not guarantee university admission.
            Always confirm admission requirements with the university.
          </p>

          {/* COURSE SECTIONS */}
          {SECTIONS.map((section) => {
            const courses = (data.matches ?? []).filter(
              (course) => course.status === section.status,
            );

            return (
              <section key={section.status}>
                <h2 className="font-bold text-lg mb-3">
                  {section.title} ({courses.length})
                </h2>

                {courses.length > 0 ? (
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <MatchCard key={course.course_id} course={course} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">{section.empty}</p>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

// One expandable card for each course.
function MatchCard({ course }) {
  const closed = course.deadline_status === "closed";

  // Calculate exactly how many APS points are missing.
  const apsShortfall =
    course.meets_aps === false &&
    typeof course.minimum_aps === "number" &&
    typeof course.learner_aps === "number"
      ? Math.max(0, course.minimum_aps - course.learner_aps)
      : null;

  const reviewReasons = course.review_reasons ?? [];
  const missingRequirements = course.missing_requirements ?? [];

  // Quick explanation shown without opening the card.
  function getQuickFeedback() {
    if (course.status === "eligible") {
      return null;
    }

    if (apsShortfall !== null && apsShortfall > 0) {
      return `${apsShortfall} APS point(s) short`;
    }

    if (missingRequirements.length > 0) {
      return "One or more subject requirements not met";
    }

    if (course.status === "needs_review") {
      return (
        reviewReasons[0] ||
        "Additional admission requirements need to be checked."
      );
    }

    return "Minimum admission requirements not met";
  }

  const quickFeedback = getQuickFeedback();

  return (
    <Card className="p-0 overflow-hidden">
      <details className="group">
        {/* COLLAPSED COURSE CARD */}
        <summary className="list-none cursor-pointer p-5 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <h3 className="font-bold text-lg">{course.course_name}</h3>

            <p className="text-sm text-slate-600">{course.institution}</p>

            <p className="text-sm text-slate-500 mt-1">
              {course.qualification_type}
              {course.duration ? ` · ${course.duration}` : ""}
            </p>

            {/* DARK-YELLOW QUICK FEEDBACK */}
            {quickFeedback && (
              <p className="text-sm font-semibold text-amber-700 mt-2">
                {quickFeedback}
              </p>
            )}
          </div>

          <span className="shrink-0 text-[#14213D] font-bold text-xl group-open:rotate-180 transition-transform">
            ⌄
          </span>
        </summary>

        {/* EXPANDED COURSE INFORMATION */}
        <div className="border-t border-slate-200 p-5 space-y-4">
          {/* APS INFORMATION */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Your APS</p>

              <p className="font-bold">{course.learner_aps ?? "N/A"}</p>
            </div>

            <div>
              <p className="text-slate-500">Minimum APS</p>

              <p className="font-bold">
                {course.minimum_aps ?? "Not applicable"}
              </p>
            </div>
          </div>

          {/* APS SHORTFALL */}
          {apsShortfall !== null && apsShortfall > 0 && (
            <p className="text-sm font-medium text-amber-700">
              Your APS is {apsShortfall} point(s) below the recorded minimum for
              this course.
            </p>
          )}

          {/* SUBJECT REQUIREMENTS */}
          {missingRequirements.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">
                Subject requirements not met
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
                {missingRequirements.map((group) => (
                  <li key={group.group_no}>
                    {group.options
                      ?.map(
                        (option) =>
                          `${option.subject} (${option.min_percent}% minimum)`,
                      )
                      .join(" OR ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ADDITIONAL REQUIREMENTS */}
          {reviewReasons.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">
                Additional admission information
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                {reviewReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* LINKED CAREERS */}
          <div className="border-t border-slate-200 pt-4">
            <p className="font-semibold text-sm mb-2">
              Possible career pathways
            </p>

            {course.careers?.length > 0 ? (
              <>
                <ul className="space-y-4 text-sm">
                  {course.careers.map((career) => (
                    <li key={career.id}>
                      <p className="font-semibold">{career.name}</p>

                      {career.description && (
                        <p className="text-slate-600">{career.description}</p>
                      )}

                      <p className="text-slate-600 mt-1">
                        Illustrative salary range:{" "}
                        <span className="font-semibold text-[#14213D]">
                          {getIllustrativeSalaryRange(career.name)} / month
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-slate-500 mt-3">
                  Salary ranges are illustrative placeholders, not verified
                  salary data. Actual earnings vary by experience, employer and
                  location.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">No careers linked yet.</p>
            )}
          </div>

          {/* APPLICATION INFORMATION */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            {course.application_deadline && (
              <p className="text-sm">
                Application deadline:{" "}
                <strong>{course.application_deadline}</strong>
              </p>
            )}

            {course.deadline_message && (
              <p
                className={`text-sm ${
                  closed
                    ? "text-red-700"
                    : course.deadline_status === "closing_soon"
                      ? "text-amber-700"
                      : "text-slate-600"
                }`}
              >
                {course.deadline_message}
              </p>
            )}

            {course.application_url && (
              <a
                href={course.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFC72C] text-[#14213D] font-bold px-4 py-2 rounded-lg text-sm"
              >
                {closed ? "View official application page" : "Apply Now"}
              </a>
            )}
          </div>
        </div>
      </details>
    </Card>
  );
}

export default Results;
