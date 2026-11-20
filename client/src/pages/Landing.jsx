import { Link } from "react-router-dom"
import { Card } from "../components/UI.jsx"

const STEPS = [
    ["1", "Enter your marks", "Once, in about two minutes."],
    ["2", "See your options", "Courses you qualify for and near misses."],
    ["3", "Know the pay", "Careers and salary ranges for each course."],
];

function Landing() {
    return (
        <div>
            {/* One column on phones, two columns from md up */}
            <div className="grid md:grid-cols-2 gap-8 items-center py-4 md:py-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Your matric marks already open doors. See which ones.
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-md">
                        Enter your marks once. See the courses you qualify for, the ones you just miss, and what the careers pay.
                    </p>
                    <div className="mt-6 flex gap-3 flex-wrap">
                        <Link to="/signup" className="bg-[#FFC72C] text-[#14213D] font-bold px-5 py-3 rounded-lg">Check my marks</Link>
                        <Link to="/login" className="border border-[#14213D] font-semibold px-5 py-3 rounded-lg">Log in</Link>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Free. Built for Grade 11 and 12 learners in Gauteng East.</p>
                </div>

                <Card className="p-4 shadow-sm">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm font-semibold">Sample result</span>
                        <span className="text-sm">APS <b className="text-2xl">31</b></span>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="border-l-4 border-[#1B8A5A] bg-green-50 p-3 rounded-r-lg">
                            <p className="font-semibold text-sm">BCom Accounting</p>
                            <p className="text-xs text-slate-600">University of Johannesburg. You qualify.</p>
                        </div>
                        <div className="border-l-4 border-[#C777000] bg-amber-50 p-3 rounded-r-lg">
                            <p className="font-semibold text-sm ">BSc Nursing</p>
                            <p className="text-xs text-slate-600">Life Sciences: 4 marks short.</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Steps stacked on phones, three across from md up */}
            <div className="grid md:grid-cols-3 mt-4 mb-6">
                {STEPS.map(([n, t, d]) => (
                    <Card key={n} className="p-4 flex gap-3 mt-4 mb-6">
                        <span className="min-w-9 h-9 rounded-lg bg-[#FFC72C] grid place-items-center font-extrabold">{n}</span>
                        <div><p className="font-bold">{t}</p><p className="text-sm text-slate-600">{d}</p></div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
export default Landing;