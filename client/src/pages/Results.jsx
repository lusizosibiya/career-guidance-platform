import { Link } from "react-router-dom"
import { useMarks } from "../context/MarksContext.jsx"
import { Card } from "../components/UI.jsx"
import CourseCard from "../components/CourseCard.jsx"
import { initialCourses, initialCareers } from "../data/mock.js"
import { matchCourses } from "../lib/match.js";

function Results() {
    const { marks } = useMarks();

    if (!marks)
        return (
          <Card className="p-8 text-center max-w-md">
            <p className="font-bold">No marks yet</p>
            <p className="text-slate-600 text-sm mt-1">Enter your marks to see your results.</p>
            <Link to="/marks" className="inline-block mt-4 bg-[#FFC72C] text-[#14213D] font-bold px-5 py-3 rounded-lg">Enter my marks</Link>
          </Card>
        );

        const { aps, qualify, almost } = matchCourses(initialCourses, marks);

        return (
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold">My results</h1>
                    <Link to="/marks" className="text-sm font-semibold underline">Edit marks</Link>
                </div>

                <div className="bg-[#14213D] text-white rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-300">Your APS score</p>
                        <p className="text-5xl font-extrabold text-[#FFC72C]">{aps}</p>
                    </div>
                    <p className="text-sm text-right text-slate-300">
                        {qualify.length} you qualify for<br />{almost.length} almost there
                    </p>
                </div>
                <section>
                    <h2 className="font-bold text-lg mb-2">You qualify for</h2>
                    <div className="space-y-3">
                        {qualify.length ? qualify.map((c) => <CourseCard key={c.id} c={c} tone="pass" careers={initialCareers} />)
                        : <p className="text-slate-600">No full matches yet. Check "Almost there" below.</p>}
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2">Almost there</h2>
                    <div className="space-y-3">
                        {almost.length ? almost.map((c) => <CourseCard key={c.id} c={c} tone="near" careers={initialCareers} />)
                        : <p className="text-slate-600">No close misses.</p>}
                    </div>
                </section>
            </div>
        );
    }

    export default Results;