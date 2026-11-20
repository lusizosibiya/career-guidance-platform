import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useMarks } from "../context/MarksContext"
import { Card } from "../components/UI.jsx"
import {  initialCourses } from "../data/mock.js"
import { matchCourses } from "../lib/match.js"

function Dashboard() {
    const { user } = useAuth();
    const { marks } = useMarks();
    const r = marks ? matchCourses(initialCourses, marks) : null;

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-extrabold">Hi {user.name}</h1>
                <p className="text-slate-600">Find out which courses your marks open up.</p>
            </div>

            {r ? (
             <div className="bg-[#14213D] text-white rounded-xl p-5 flex items-center justify-between">
                <div>
                   <p className="text-sm text-slate-300">Your APS score</p>
                   <p className="text-5xl font-extrabold text-[#FFC72C]">{r.aps}</p>
                    </div> 
                    <p className="text-sm text-right text-slate-300">
                        {r.qualify.legnth} you qualify for<br />{r.almost.length} almost there
                    </p>
                    </div>
            ) : (
                <Card className="p-5">
                    <p className="font-bold">You have not entered your marks yet</p>
                    <p className="text-sm text-slate-600 mt-1">It takes about two minutes.</p>
                    <Link to="/marks" className="inline-block mt-3 bg-[#FFC72C] text-[#14213D] font-bold px-5 py-3 rounded-lg">Enter my marks</Link>
                </Card>
            )
            }
            {/* Stacked on phones, side by side from sm (640px) up */}
            <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/marks">
                <Card className="p-4 hover:bg-white/60">
                <p className="font-bold">{marks ? "Update my marks" : "Enter my marks"}</p>
                <p className="text-sm text-slate-600">Add or change your subjects and percentages.</p>
                </Card>
                </Link>
                <Link to="/results">
                <Card className="p-4 hover:bg-white/60">
                <p className="font-bold">See my results</p>
                <p className="text-sm text-slate-600">Courses you qualify for and near misses.</p>
                </Card>
                </Link>
            </div>
        </div>
    );
}
export default Dashboard;