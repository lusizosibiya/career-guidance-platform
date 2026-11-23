import { supabase } from "../config/supabase.js";
import { calculateWitsAPS, calculateUKZNAPS } from "../utils/calculateAPS.js";
import { checkRequirements } from "../utils/checkRequirements.js";
import { checkDeadline } from "../utils/checkDeadline.js";

export async function matchCourses(req, res) {
  try {
    const { subjects } = req.body;

    // 1. Validate learner input
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        message: "Please provide your subjects and marks.",
      });
    }

    const validSubjects = subjects.every(
      (item) =>
        item &&
        typeof item.subject === "string" &&
        item.subject.trim() !== "" &&
        typeof item.percentage === "number" &&
        Number.isFinite(item.percentage) &&
        item.percentage >= 0 &&
        item.percentage <= 100,
    );

    const normalizedNames = subjects.map((item) =>
      typeof item?.subject === "string"
        ? item.subject.trim().toLowerCase()
        : "",
    );

    if (!validSubjects || new Set(normalizedNames).size !== subjects.length) {
      return res.status(400).json({
        message: "Invalid or duplicate subjects and marks.",
      });
    }

    // 2. Retrieve admission data from Supabase
    const [
      institutionsResult,
      coursesResult,
      requirementsResult,
      careerLinksResult,
      careersResult,
    ] = await Promise.all([
      supabase.from("institutions").select("*"),
      supabase.from("courses").select("*"),
      supabase.from("course_requirements").select("*"),
      supabase.from("course_careers").select("*"),
      supabase.from("careers").select("*"),
    ]);

    const results = [
      institutionsResult,
      coursesResult,
      requirementsResult,
      careerLinksResult,
      careersResult,
    ];

    const databaseError = results.find((result) => result.error);

    if (databaseError) {
      console.error("Supabase error:", databaseError.error);

      return res.status(500).json({
        message: "Could not retrieve course information.",
      });
    }

    const institutions = institutionsResult.data ?? [];
    const courses = coursesResult.data ?? [];
    const requirements = requirementsResult.data ?? [];
    const careerLinks = careerLinksResult.data ?? [];
    const careers = careersResult.data ?? [];

    // 3. Calculate APS for each university
    const apsResults = {};

    for (const institution of institutions) {
      const method =
        institution.aps_rules?.calculation_method ??
        (institution.name.toLowerCase().includes("witwatersrand")
          ? "wits"
          : institution.name.toLowerCase().includes("kwazulu")
            ? "ukzn"
            : null);

      try {
        if (method === "wits") {
          apsResults[institution.id] = {
            aps: calculateWitsAPS(subjects),
            error: null,
          };
        } else if (method === "ukzn") {
          apsResults[institution.id] = {
            aps: calculateUKZNAPS(subjects),
            error: null,
          };
        } else {
          apsResults[institution.id] = {
            aps: null,
            error: "APS calculation method unavailable.",
          };
        }
      } catch (error) {
        apsResults[institution.id] = {
          aps: null,
          error: error.message,
        };
      }
    }

    // 4. Compare learner results with every course
    const matches = courses.map((course) => {
      const institution = institutions.find(
        (item) => item.id === course.institution_id,
      );

      const apsInfo = apsResults[course.institution_id] ?? {
        aps: null,
        error: "Institution information unavailable.",
      };

      const courseRequirements = requirements.filter(
        (item) => item.course_id === course.id,
      );

      const requirementResult = checkRequirements(subjects, courseRequirements);

      const linkedCareerIds = careerLinks
        .filter((link) => link.course_id === course.id)
        .map((link) => link.career_id);

      const linkedCareers = careers.filter((career) =>
        linkedCareerIds.includes(career.id),
      );

      const minimumAPS =
        typeof course.min_aps === "number" ? course.min_aps : null;

      const meetsAPS =
        apsInfo.aps !== null && minimumAPS !== null
          ? apsInfo.aps >= minimumAPS
          : null;

      // Additional selection rules may need manual review.
      const additionalSelection =
        typeof course.additional_requirements === "string" &&
        course.additional_requirements.trim() !== "";

      const reviewReasons = [];

      if (apsInfo.aps === null) {
        reviewReasons.push(apsInfo.error ?? "APS could not be calculated.");
      }

      if (minimumAPS === null) {
        reviewReasons.push(
          "This programme does not have a standard APS threshold recorded.",
        );
      }

      if (requirementResult.needsReview) {
        reviewReasons.push("Compulsory subject requirements are unavailable.");
      }

      if (additionalSelection) {
        reviewReasons.push(course.additional_requirements);
      }

      let status = "needs_review";

      const knownFailure =
        meetsAPS === false ||
        (courseRequirements.length > 0 &&
          requirementResult.meetsRequirements === false);

      const incompleteInformation =
        apsInfo.aps === null ||
        minimumAPS === null ||
        requirementResult.needsReview ||
        additionalSelection;

      if (knownFailure) {
        status = "not_eligible";
      } else if (!incompleteInformation) {
        status = "eligible";
      }

      const deadlineInfo = checkDeadline(course.application_deadline);

      return {
        course_id: course.id,
        course_name: course.name,
        institution: institution?.name ?? "Unknown institution",
        institution_id: course.institution_id,
        fields: course.fields,
        qualification_type: course.qualification_type,
        duration: course.duration,

        learner_aps: apsInfo.aps,
        minimum_aps: minimumAPS,
        meets_aps: meetsAPS,

        meets_subject_requirements: requirementResult.needsReview
          ? null
          : requirementResult.meetsRequirements,

        missing_requirements: requirementResult.missingRequirements,

        additional_requirements: course.additional_requirements,

        aps_error: apsInfo.error,

        review_reasons: reviewReasons,

        careers: linkedCareers.map((career) => ({
          id: career.id,
          name: career.name,
          description: career.description,
        })),

        application_url: course.application_url,
        application_deadline: course.application_deadline,

        deadline_status: deadlineInfo.deadline_status,
        days_remaining: deadlineInfo.days_remaining,
        deadline_message: deadlineInfo.deadline_message,

        status,
      };
    });

    // 5. Put the strongest matches first
    const priority = {
      eligible: 0,
      needs_review: 1,
      not_eligible: 2,
    };

    matches.sort((a, b) => priority[a.status] - priority[b.status]);

    // 6. Send results back to the frontend
    return res.status(200).json({
      message: "Course matching completed.",
      total_courses: matches.length,
      summary: {
        eligible: matches.filter((course) => course.status === "eligible")
          .length,
        needs_review: matches.filter(
          (course) => course.status === "needs_review",
        ).length,
        not_eligible: matches.filter(
          (course) => course.status === "not_eligible",
        ).length,
      },
      aps_by_institution: institutions.map((institution) => ({
        institution_id: institution.id,
        institution: institution.name,
        ...apsResults[institution.id],
      })),
      matches,
    });
  } catch (error) {
    console.error("Matching error:", error);

    return res.status(500).json({
      message: "Something went wrong during matching.",
    });
  }
}
