import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api.js";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ institutions: "-", courses: "-", careers: "-" });

  // count what is in the database
  useEffect(() => {
    Promise.all([
      apiRequest("/api/institutions"),
      apiRequest("/api/courses"),
      apiRequest("/api/careers"),
    ])
      .then(([institutions, courses, careers]) =>
        setCounts({ institutions: institutions.length, courses: courses.length, careers: careers.length })
      )
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Institutions", count: counts.institutions, to: "/admin/institutions" },
    { label: "Courses", count: counts.courses, to: "/admin/courses" },
    { label: "Careers", count: counts.careers, to: "/admin" },
  ];
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-xl bg-[#14213D] p-5 text-white hover:bg-[#1f3159]"
          >
            <p className="text-sm text-slate-300">{card.label}</p>
            <p className="mt-1 text-4xl font-extrabold text-[#FFC72C]">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}