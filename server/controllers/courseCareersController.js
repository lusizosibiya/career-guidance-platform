import { supabase } from "../config/supabase.js";

const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// GET /api/courses/:courseId/careers
export const getCourseCareers = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!uuidPattern.test(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        const { data, error } = await supabase
            .from("course_careers")
            .select("careers(id, name, description)")
            .eq("course_id", courseId);

        if (error) throw error;

        res.status(200).json(
            data.map((item) => item.careers)
        );
    } catch (error) {
        console.error("Get course careers failed:", error.message);

        res.status(500).json({
            message: "Failed to fetch course careers",
        });
    }
};

// PUT /api/courses/:courseId/careers
export const replaceCourseCareers = async (req, res) => {
    try {
        const { courseId } = req.params;
        const careerIds = req.body?.career_ids;

        if (!uuidPattern.test(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        if (
            !Array.isArray(careerIds) ||
            !careerIds.every(
                (id) => typeof id === "string" && uuidPattern.test(id)
            ) ||
            new Set(careerIds).size !== careerIds.length
        ) {
            return res.status(400).json({
                message: "Provide an array of unique valid career IDs",
            });
        }

        const { data, error } = await supabase.rpc(
            "replace_course_careers",
            {
                p_course_id: courseId,
                p_career_ids: careerIds,
            }
        );

        if (error) {
            if (error.code === "23503") {
                return res.status(400).json({
                    message: "One or more careers do not exist",
                });
            }

            if (error.message.includes("Course not found")) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            throw error;
        }

        res.status(200).json({
            message: "Course careers updated successfully",
            links: data,
        });
    } catch (error) {
        console.error("Link careers failed:", error.message);

        res.status(500).json({
            message: "Failed to update course careers",
        });
    }
};