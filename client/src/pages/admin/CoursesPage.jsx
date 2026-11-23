import { useEffect, useState } from "react";
import { FIELDS } from "../../data/sampleData";
import { SUBJECTS } from "../../data/subjects.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const emptyForm = {
  name: "",
  institution_id: "",
  fields: [],
  qualification_type: "Degree",
  min_aps: 0,
  duration: "",
  additional_requirements: "",
  requirement_groups: [],
  career_ids: [],
};

const newOption = () => ({ subject: SUBJECTS[0], min_percent: 50 });

// database rows -> form groups (rows with the same group_no are alternatives)
function rowsToGroups(rows) {
  const groups = {};
  rows.forEach((row) => {
    groups[row.group_no] ??= { options: [] };
    groups[row.group_no].options.push({ subject: row.subject, min_percent: row.min_percent });
  });
  return Object.keys(groups)
    .sort((a, b) => a - b)
    .map((key) => groups[key]);
}

// form groups -> database rows, numbering the groups 1, 2, 3...
function groupsToRows(groups) {
  return groups.flatMap((group, index) =>
    group.options.map((option) => ({
      subject: option.subject,
      min_percent: option.min_percent,
      group_no: index + 1,
    }))
  );
}

export default function CoursesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = form closed, "new" = adding
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");

  // load courses, institutions and careers from the database when the page opens
  useEffect(() => {
    Promise.all([
      apiRequest("/api/courses"),
      apiRequest("/api/institutions"),
      apiRequest("/api/careers"),
    ])
      .then(([courseData, institutionData, careerData]) => {
        setItems(courseData);
        setInstitutions(institutionData);
        setCareers(careerData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function institutionName(id) {
    return institutions.find((i) => i.id === id)?.name ?? "Unknown institution";
  }

  function openAdd() {
    setForm({ ...structuredClone(emptyForm), institution_id: institutions[0]?.id ?? "" });
    setEditingId("new");
  }

  async function openEdit(course) {
    setError("");
    try {
      // requirements and careers are stored separately, so load them for this course
      const [requirementRows, linkedCareers] = await Promise.all([
        apiRequest(`/api/courses/${course.id}/requirements`),
        apiRequest(`/api/courses/${course.id}/careers`),
      ]);
      setForm({
        ...structuredClone(emptyForm),
        ...structuredClone(course),
        fields: course.fields ?? [],
        min_aps: course.min_aps ?? 0,
        duration: course.duration ?? "",
        additional_requirements: course.additional_requirements ?? "",
        requirement_groups: rowsToGroups(requirementRows),
        career_ids: linkedCareers.map((career) => career.id),
      });
      setEditingId(course.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function closeForm() {
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "min_aps" ? Number(value) : value });
  }

  function toggleInList(key, value) {
    const list = form[key];
    const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    setForm({ ...form, [key]: updated });
  }

    // the learner must meet every group, but only one subject option inside each group
  function setGroups(requirement_groups) {
    setForm({ ...form, requirement_groups });
  }

  function addGroup() {
    setGroups([...form.requirement_groups, { options: [newOption()] }]);
  }

  function removeGroup(groupIndex) {
    setGroups(form.requirement_groups.filter((_, i) => i !== groupIndex));
  }

  function addOption(groupIndex) {
    setGroups(
      form.requirement_groups.map((group, i) =>
        i === groupIndex ? { options: [...group.options, newOption()] } : group
      )
    );
  }

  function removeOption(groupIndex, optionIndex) {
    const groups = form.requirement_groups
      .map((group, i) =>
        i === groupIndex ? { options: group.options.filter((_, j) => j !== optionIndex) } : group
      )
      .filter((group) => group.options.length > 0);
    setGroups(groups);
  }

  function handleOptionChange(groupIndex, optionIndex, key, value) {
    setGroups(
      form.requirement_groups.map((group, i) =>
        i === groupIndex
          ? {
              options: group.options.map((option, j) =>
                j === optionIndex
                  ? { ...option, [key]: key === "min_percent" ? Number(value) : value }
                  : option
              ),
            }
          : group
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.fields.length === 0) {
      alert("Choose at least one field for this course.");
      return;
    }

    const body = {
      institution_id: form.institution_id,
      name: form.name,
      fields: form.fields,
      qualification_type: form.qualification_type,
      min_aps: form.min_aps,
      duration: form.duration,
      additional_requirements: form.additional_requirements,
    };

    setSaving(true);
    setError("");
    try {
      const saved =
        editingId === "new"
          ? await apiRequest("/api/courses", { method: "POST", body, token })
          : await apiRequest(`/api/courses/${editingId}`, { method: "PUT", body, token });

      // requirements and careers are saved separately for the course
      await apiRequest(`/api/courses/${saved.id}/requirements`, {
        method: "PUT",
        body: { requirements: groupsToRows(form.requirement_groups) },
        token,
      });
      await apiRequest(`/api/courses/${saved.id}/careers`, {
        method: "PUT",
        body: { career_ids: form.career_ids },
        token,
      });

      if (editingId === "new") {
        setItems([...items, saved]);
      } else {
        setItems(items.map((c) => (c.id === saved.id ? saved : c)));
      }
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(course) {
    if (!window.confirm(`Delete ${course.name}?`)) return;
    setError("");
    try {
      await apiRequest(`/api/courses/${course.id}`, { method: "DELETE", token });
      setItems(items.filter((c) => c.id !== course.id));
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleCourses = filter === "all" ? items : items.filter((c) => c.institution_id === filter);

  const inputClass = "mt-1 w-full rounded-md border border-[#D9DFE8] px-3 py-2 text-sm";
  const buttonPrimary = "rounded-md bg-[#14213D] px-4 py-2 text-sm text-white hover:bg-[#1f3159]";
  const buttonSecondary = "rounded-md border border-[#D9DFE8] px-4 py-2 text-sm hover:bg-gray-100";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        {!editingId && (
          <button onClick={openAdd} className={buttonPrimary}>
            Add course
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-gray-500">Loading courses...</p>}

      {editingId && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-6 rounded-lg border border-[#D9DFE8] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{editingId === "new" ? "Add course" : "Edit course"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              Course name
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </label>
            <label className="block text-sm">
              Institution
              <select name="institution_id" value={form.institution_id} onChange={handleChange} className={inputClass}>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Qualification type
              <select name="qualification_type" value={form.qualification_type} onChange={handleChange} className={inputClass}>
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Higher Certificate">Higher Certificate</option>
              </select>
            </label>
            <label className="block text-sm">
              Minimum APS
              <input name="min_aps" type="number" min="0" max="60" value={form.min_aps} onChange={handleChange} className={inputClass} />
            </label>
            <label className="block text-sm">
              Duration
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 years" className={inputClass} />
            </label>
          </div>

          <fieldset className="rounded-md border border-[#D9DFE8] p-4">
            <legend className="px-1 text-sm font-semibold">Fields</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.fields.includes(field)} onChange={() => toggleInList("fields", field)} />
                  {field}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-md border border-[#D9DFE8] p-4">
            <legend className="px-1 text-sm font-semibold">Subject requirements</legend>
            <p className="text-xs text-gray-500">
              The learner must meet every requirement. Where a requirement lists more than one subject, any one of them is enough.
            </p>

            {form.requirement_groups.length === 0 && (
              <p className="text-sm text-gray-500">No subject requirements added yet.</p>
            )}

            {form.requirement_groups.map((group, groupIndex) => (
              <div key={groupIndex} className="rounded-md border border-[#D9DFE8] bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Requirement {groupIndex + 1}</p>
                  <button type="button" onClick={() => removeGroup(groupIndex)} className="text-sm text-red-600 hover:underline">
                    Remove requirement
                  </button>
                </div>

                <div className="space-y-2">
                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      {optionIndex > 0 && <p className="mb-2 text-xs font-semibold uppercase text-gray-400">or</p>}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <select
                          value={option.subject}
                          onChange={(e) => handleOptionChange(groupIndex, optionIndex, "subject", e.target.value)}
                          className="flex-1 rounded-md border border-[#D9DFE8] bg-white px-2 py-1"
                        >
                          {SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-500">at least</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={option.min_percent}
                          onChange={(e) => handleOptionChange(groupIndex, optionIndex, "min_percent", e.target.value)}
                          className="w-20 rounded-md border border-[#D9DFE8] px-2 py-1"
                        />
                        <span className="text-gray-500">%</span>
                        {group.options.length > 1 && (
                          <button type="button" onClick={() => removeOption(groupIndex, optionIndex)} className="text-red-600 hover:underline">
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={() => addOption(groupIndex)} className="mt-2 text-sm text-[#14213D] hover:underline">
                  + Add alternative subject
                </button>
              </div>
            ))}

            <button type="button" onClick={addGroup} className="text-sm text-[#14213D] hover:underline">
              + Add requirement
            </button>
          </fieldset>

          <label className="block text-sm">
            Additional requirements
            <textarea
              name="additional_requirements"
              rows="2"
              value={form.additional_requirements}
              onChange={handleChange}
              placeholder="e.g. NBT results, interview, portfolio"
              className={inputClass}
            />
          </label>

          <fieldset className="rounded-md border border-[#D9DFE8] p-4">
            <legend className="px-1 text-sm font-semibold">Careers this course leads to</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {careers.map((career) => (
                <label key={career.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.career_ids.includes(career.id)}
                    onChange={() => toggleInList("career_ids", career.id)}
                  />
                {career.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={buttonPrimary}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={closeForm} className={buttonSecondary}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-[#D9DFE8] bg-white px-3 py-2 text-sm">
          <option value="all">All institutions</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {visibleCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col gap-3 rounded-lg border border-[#D9DFE8] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{course.name}</p>
              <p className="text-sm text-gray-500">
                {institutionName(course.institution_id)} · {course.qualification_type} · {course.duration}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(course.fields ?? []).map((field) => (
                  <span key={field} className="rounded-full bg-[#FFC72C]/25 px-2 py-0.5 text-xs text-[#14213D]">
                    {field}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Min APS: {course.min_aps ?? "not set"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(course)} className="rounded-md border border-[#D9DFE8] px-3 py-1.5 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button onClick={() => handleDelete(course)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
        {visibleCourses.length === 0 && <p className="text-sm text-gray-500">No courses found.</p>}
      </div>
    </div>
  );
}