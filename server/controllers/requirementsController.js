import { supabase } from "../config/supabase.js";

export const getRequirements = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("course_requirements")
            .select("*")
            .eq("course_id", req.params.courseId)
            .order("group_no");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to fetch requirements",
        });
    }
};

export const replaceRequirements = async (req, res) => {
    try {
        const requirements = req.body?.requirements;

        if (
            !Array.isArray(requirements) ||
            !requirements.every((item) =>
                typeof item.subject === "string" &&
                item.subject.trim().length > 0 &&
                Number.isInteger(item.min_percent) &&
                item.min_percent >= 0 &&
                item.min_percent <= 100 &&
                Number.isInteger(item.group_no) &&
                item.group_no > 0
            )
        ) {
            return res.status(400).json({
                message: "Invalid subject requirements",
            });
        }

        const cleanRequirements = requirements.map((item) => ({
            subject: item.subject.trim(),
            min_percent: item.min_percent,
            group_no: item.group_no,
        }));

        const { data, error } = await supabase.rpc(
            "replace_course_requirements",
            {
                p_course_id: req.params.courseId,
                p_requirements: cleanRequirements,
            }
        );

        if (error) {
            if (error.message.includes("Course not found")) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to save requirements",
        });
    }
};