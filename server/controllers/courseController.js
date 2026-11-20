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
