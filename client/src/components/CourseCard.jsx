import { useState } from "react"
import { Card } from "./UI.jsx"

// Colour and heading for each result from /api/match
const TONES = {
    eligible: { border: "border-[#1B8A5A]", text: "text-[#1B8A5A]", label: "You meet the minimum requirements" },
    needs_review: { border: "border-[#C77700]", text: "text-[#C77700]", label: "Check with the university" },
    not_eligible: { border: "border-slate-300", text: "text-slate-600", label: "Not yet" },
};

// "Physical Sciences 60% or Life Sciences 60%"
const describeGroup = (group) =>
    group.options.map((o) => `${o.subject} ${o.min_percent}%`).join(" or ");

// One course from the matching results. Tap to see the details.
function CourseCard({ m }) {
    const [open, setOpen] = useState(false);
    const tone = TONES[m.status] ?? TONES.needs_review;
    const details = [m.institution, m.qualification_type, m.duration].filter(Boolean).join(" · ");

    return (
        <Card className={`border-l-4 ${tone.border} p-4`}>
            <button type="button" className="w-full text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
                <p className="font-bold">{m.course_name}</p>
                <p className="text-sm text-slate-600">{details}</p>
                <p className={`text-sm font-semibold mt-1 ${tone.text}`}>{tone.label}</p>
                {m.minimum_aps !== null && (
                    <p className="text-sm text-slate-600">
                        APS needed: {m.minimum_aps}{m.learner_aps !== null ? ` · yours: ${m.learner_aps}` : ""}
                    </p>
                )}
            </button>

            {open && (
                <div className="mt-3 pt-3 border-t border-[#D9DFE8] text-sm space-y-3">
                    {m.meets_aps === false && (
                        <p>Your APS is {m.minimum_aps - m.learner_aps} short for this course.</p>
                    )}

                    {m.missing_requirements?.length > 0 && (
                        <div>
                            <p className="font-semibold">Subjects you still need</p>
                            <ul className="list-disc pl-5 text-slate-700">
                                {m.missing_requirements.map((g) => <li key={g.group_no}>{describeGroup(g)}</li>)}
                            </ul>
                        </div>
                    )}

                    {m.status === "needs_review" && m.review_reasons?.length > 0 && (
                        <div>
                            <p className="font-semibold">Why to check</p>
                            <ul className="list-disc pl-5 text-slate-700">
                                {m.review_reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                            </ul>
                        </div>
                    )}

                    {m.status === "not_eligible" && (
                        <p className="text-slate-600">
                            Ways to close the gap: improve your marks (for example a matric rewrite), a bridging or extended programme, or a TVET college route.
                        </p>
                    )}

                    <div>
                        <p className="font-semibold">Careers</p>
                        {m.careers?.length ? (
                            <ul className="list-disc pl-5 text-slate-700">
                                {m.careers.map((c) => (
                                    <li key={c.id}>
                                        <span className="font-medium text-slate-900">{c.name}</span>
                                        {c.description ? `: ${c.description}` : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-600">No careers linked yet.</p>
                        )}
                    </div>

                    {m.deadline_status !== "unknown" && m.deadline_message && (
                        <p className={m.deadline_status === "closed" ? "text-red-700" : "text-slate-700"}>{m.deadline_message}</p>
                    )}

                    {m.application_url && (
                        <a href={m.application_url} target="_blank" rel="noreferrer" className="inline-block font-semibold underline">
                            How to apply
                        </a>
                    )}
                </div>
            )}
        </Card>
    );
}

export default CourseCard;