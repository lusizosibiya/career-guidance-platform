import { Link } from "react-router-dom";
import { institutions, courses, careers } from "../../data/sampleData";

const cards = [
  { label: "Institutions", count: institutions.length, to: "/admin/institutions" },
  { label: "Courses", count: courses.length, to: "/admin/courses" },
  { label: "Careers", count: careers.length, to: "/admin" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-lg border bg-white p-5 shadow-sm hover:shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}