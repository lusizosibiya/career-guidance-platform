import courses from "../data/courses.js";

export const getAllCourses = (req, res) => {
  res.status(200).json(courses);
};

export const getCourseById = (req, res) => {
  const course = courses.find(
    (course) => course.id === req.params.id
  );

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  res.status(200).json(course);
};
