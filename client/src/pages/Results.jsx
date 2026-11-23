import { Link } from "react-router-dom"
import { useMarks } from "../context/MarksContext.jsx"
import { Card } from "../components/UI.jsx"
import CourseCard from "../components/CourseCard.jsx"
import { useMatch } from "../lib/useMatch.js"

const SECTIONS = [
    { status: "eligible", title: "You meet the minimum requirements", empty: "No full matches yet. Check the sections below." },
    { status: "needs_review", title: "Check with the university", empty: "Nothing to check." },
    { status: "not_eligible", title: "Not yet", empty: "None." },
];

function Results() {
    const { marks } = useMarks();
    const { data, loading, error } = useMatch(marks);

    if (!marks?.length)
        return (
          <Card className="p-8 text-center max-w-md">
            <p className="font-bold">No marks yet</p>
            <p className="text-slate-600 text-sm mt-1">Enter your marks to see your results.</p>
            <Link to="/marks" className="inline-block mt-4 bg-[#FFC72C] text-[#14213D] font-bold px-5 py-3 rounded-lg">Enter my marks</Link>
          </Card>
        );

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">My results</h1>
                <Link to="/marks" className="text-sm font-semibold underline">Edit marks</Link>
            </div>

            {loading && <p className="text-slate-600">Matching your marks...</p>}
            {error && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            {data && (
                <>
                    <div className="bg-[#14213D] text-white rounded-xl p-5">
                        <p className="text-sm text-slate-300">Your APS score</p>
                        <div className="mt-2 grid sm:grid-cols-2 gap-4">
                            {data.aps_by_institution.map((a) => (
                                <div key={a.institution_id}>
                                    <p className="text-sm text-slate-300">{a.institution}</p>
                                    {a.aps !== null
                                        ? <p className="text-4xl font-extrabold text-[#FFC72C]">{a.aps}</p>
                                        : <p className="text-sm text-[#FFC72C]">{a.error}</p>}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-300 mt-3">
                            {data.summary.eligible} you qualify for · {data.summary.needs_review} to check · {data.summary.not_eligible} not yet
                        </p>
                    </div>

                    {SECTIONS.map((s) => {
                        const list = data.matches.filter((m) => m.status === s.status);
                        return (
                            <section key={s.status}>
                                <h2 className="font-bold text-lg mb-2">{s.title} ({list.length})</h2>
                                <div className="space-y-3">
                                    {list.length
                                        ? list.map((m) => <CourseCard key={m.course_id} m={m} />)
                                        : <p className="text-slate-600">{s.empty}</p>}
                                </div>
                            </section>
                        );
                    })}

                    <p className="text-xs text-slate-500">
                        Meeting the minimum requirements means you can apply, not that you are guaranteed a place. Always confirm with the university.
                    </p>
                </>
            )}
        </div>
    );
}

export default Results;