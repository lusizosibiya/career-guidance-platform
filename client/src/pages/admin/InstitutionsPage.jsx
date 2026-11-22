import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const defaultRules = {
  subjects_counted: 6,
  life_orientation: "exclude",
  scale: [
    { min: 80, points: 7 },
    { min: 70, points: 6 },
    { min: 60, points: 5 },
    { min: 50, points: 4 },
    { min: 40, points: 3 },
    { min: 30, points: 2 },
    { min: 0, points: 1 },
  ],
  notes: "",
};

const emptyForm = {
  name: "",
  type: "university",
  location: "",
  website: "",
  aps_rules: defaultRules,
};

const loLabels = {
  exclude: "Life Orientation not counted",
  half: "Life Orientation counts half",
  full: "Life Orientation counts fully",
};

export default function InstitutionsPage() {
    const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = form closed, "new" = adding
  const [form, setForm] = useState(emptyForm);

  // load the institutions from the database when the page opens
  useEffect(() => {
    apiRequest("/api/institutions")
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm(structuredClone(emptyForm));
    setEditingId("new");
  }

    function openEdit(institution) {
    // fill in blanks so the form still works if a field is empty in the database
    setForm({
      ...structuredClone(emptyForm),
      ...structuredClone(institution),
      location: institution.location ?? "",
      website: institution.website ?? "",
      aps_rules: { ...structuredClone(defaultRules), ...institution.aps_rules },
    });
    setEditingId(institution.id);
  }

  function closeForm() {
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleRuleChange(e) {
    const { name, value } = e.target;
    const newValue = name === "subjects_counted" ? Number(value) : value;
    setForm({ ...form, aps_rules: { ...form.aps_rules, [name]: newValue } });
  }

  function handleScaleChange(index, key, value) {
    const scale = form.aps_rules.scale.map((row, i) =>
      i === index ? { ...row, [key]: Number(value) } : row
    );
    setForm({ ...form, aps_rules: { ...form.aps_rules, scale } });
  }

  function addScaleRow() {
    const scale = [...form.aps_rules.scale, { min: 0, points: 0 }];
    setForm({ ...form, aps_rules: { ...form.aps_rules, scale } });
  }

  function removeScaleRow(index) {
    const scale = form.aps_rules.scale.filter((_, i) => i !== index);
    setForm({ ...form, aps_rules: { ...form.aps_rules, scale } });
  }

    async function handleSubmit(e) {
    e.preventDefault();
    // keep the scale ordered from highest to lowest percentage
    const scale = [...form.aps_rules.scale].sort((a, b) => b.min - a.min);
    const body = {
      name: form.name,
      type: form.type,
      location: form.location,
      website: form.website,
      aps_rules: { ...form.aps_rules, scale },
    };

    setSaving(true);
    setError("");
    try {
      if (editingId === "new") {
        const created = await apiRequest("/api/institutions", { method: "POST", body, token });
        setItems([...items, created]);
      } else {
        const updated = await apiRequest(`/api/institutions/${editingId}`, { method: "PUT", body, token });
        setItems(items.map((i) => (i.id === editingId ? updated : i)));
      }
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(institution) {
    if (!window.confirm(`Delete ${institution.name}?`)) return;
    setError("");
    try {
      await apiRequest(`/api/institutions/${institution.id}`, { method: "DELETE", token });
      setItems(items.filter((i) => i.id !== institution.id));
    } catch (err) {
      setError(err.message);
    }
  }

  const inputClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm";
  const buttonPrimary = "rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700";
  const buttonSecondary = "rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Institutions</h1>
        {!editingId && (
          <button onClick={openAdd} className={buttonPrimary}>
            Add institution
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-gray-500">Loading institutions...</p>}
    
      
      {editingId && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">
            {editingId === "new" ? "Add institution" : "Edit institution"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Name
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </label>
            <label className="block text-sm">
              Type
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="university">University</option>
                <option value="tvet">TVET college</option>
              </select>
            </label>
            <label className="block text-sm">
              Location
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
            </label>
            <label className="block text-sm">
              Website
              <input name="website" type="url" value={form.website} onChange={handleChange} className={inputClass} />
            </label>
          </div>

          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-1 text-sm font-semibold">APS rules</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Number of subjects counted
                <input
                  name="subjects_counted"
                  type="number"
                  min="1"
                  max="7"
                  value={form.aps_rules.subjects_counted}
                  onChange={handleRuleChange}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                Life Orientation
                <select
                  name="life_orientation"
                  value={form.aps_rules.life_orientation}
                  onChange={handleRuleChange}
                  className={inputClass}
                >
                  <option value="exclude">Not counted</option>
                  <option value="half">Counts half</option>
                  <option value="full">Counts fully</option>
                </select>
              </label>
            </div>

            <div>
              <p className="mb-2 text-sm">Points scale</p>
              <div className="space-y-2">
                {form.aps_rules.scale.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2 text-sm">
                   <span className="text-gray-500">From</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.min}
                      onChange={(e) => handleScaleChange(index, "min", e.target.value)}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    />
                    <span className="text-gray-500">% =</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={row.points}
                      onChange={(e) => handleScaleChange(index, "points", e.target.value)}
                      className="w-16 rounded-md border border-gray-300 px-2 py-1"
                    />
                    <span className="text-gray-500">points</span>
                    <button
                      type="button"
                      onClick={() => removeScaleRow(index)}
                      className="ml-auto text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addScaleRow} className="mt-2 text-sm text-blue-600 hover:underline">
                + Add row
              </button>
            </div>

            <label className="block text-sm">
              Notes
              <textarea
                name="notes"
                rows="2"
                value={form.aps_rules.notes}
                onChange={handleRuleChange}
                placeholder="Anything special about how this institution calculates APS"
                className={inputClass}
              />
            </label>
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

      <div className="space-y-3">
        {items.map((institution) => (
          <div
            key={institution.id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{institution.name}</p>
              <p className="text-sm text-gray-500">
                {institution.type === "tvet" ? "TVET college" : "University"} · {institution.location}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                APS: best {institution.aps_rules?.subjects_counted ?? "?"} subjects ·{" "}
                {loLabels[institution.aps_rules?.life_orientation] ?? "Life Orientation not set"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(institution)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button onClick={() => handleDelete(institution)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}