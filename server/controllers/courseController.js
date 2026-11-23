import { supabase } from "../config/supabase.js";

// GET /api/courses
export const getAllCourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*, institutions(name)")
      .order("name");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch courses:", error.message);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*, institutions(name)")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch course:", error.message);

    res.status(500).json({
      message: "Failed to fetch course",
    });
  }
};

const courseFields = [
  "institution_id",
  "name",
  "fields",
  "qualification_type",
  "min_aps",
  "duration",
  "additional_requirements",
  "application_url",
  "application_deadline",
  "source_url",
  "admission_year",
];

function prepareCourse(body = {}) {
  return Object.fromEntries(
    courseFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]]),
  );
}

function validCourse(course) {
  return (
    typeof course.institution_id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      course.institution_id,
    ) &&
    typeof course.name === "string" &&
    course.name.trim().length > 0 &&
    (course.fields === undefined ||
      (Array.isArray(course.fields) &&
        course.fields.every((f) => typeof f === "string"))) &&
    (course.min_aps == null ||
      (Number.isInteger(course.min_aps) &&
        course.min_aps >= 0 &&
        course.min_aps <= 100))
  );
}

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const course = prepareCourse(req.body ?? {});

    if (!validCourse(course)) {
      return res.status(400).json({
        message: "Invalid course data",
      });
    }

    const { data, error } = await supabase
      .from("courses")
      .insert(course)
      .select()
      .single();

    if (error?.code === "23503") {
      return res.status(400).json({
        message: "Institution does not exist",
      });
    }

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error("Create course failed:", error.message);
    res.status(500).json({
      message: "Failed to create course",
    });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const course = prepareCourse(req.body ?? {});

    if (!validCourseUpdate(course)) {
      return res.status(400).json({
        message: "Invalid course data",
      });
    }

    const { data, error } = await supabase
      .from("courses")
      .update(course)
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error?.code === "23503") {
      return res.status(400).json({
        message: "Institution does not exist",
      });
    }

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Update course failed:", error.message);
    res.status(500).json({
      message: "Failed to update course",
    });
  }
};

function validCourseUpdate(course) {
  if (Object.keys(course).length === 0) {
    return false;
  }

  const has = (field) => Object.prototype.hasOwnProperty.call(course, field);

  if (has("institution_id")) {
    if (
      typeof course.institution_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        course.institution_id,
      )
    ) {
      return false;
    }
  }

  if (has("name")) {
    if (typeof course.name !== "string" || course.name.trim().length === 0) {
      return false;
    }
  }

  if (has("fields")) {
    if (
      !Array.isArray(course.fields) ||
      !course.fields.every((field) => typeof field === "string")
    ) {
      return false;
    }
  }

  if (has("min_aps")) {
    if (
      course.min_aps !== null &&
      (!Number.isInteger(course.min_aps) ||
        course.min_aps < 0 ||
        course.min_aps > 100)
    ) {
      return false;
    }
  }

  if (has("application_deadline")) {
    const date = course.application_deadline;

    if (
      date !== null &&
      (typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(`${date}T00:00:00Z`)))
    ) {
      return false;
    }
  }

  if (has("application_url")) {
    const url = course.application_url;

    if (url !== null) {
      try {
        const parsed = new URL(url);

        if (!["https:", "http:"].includes(parsed.protocol)) {
          return false;
        }
      } catch {
        return false;
      }
    }
  }

  return true;
}

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .delete()
      .eq("id", req.params.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Delete course failed:", error.message);
    res.status(500).json({
      message: "Failed to delete course",
    });
  }
};
