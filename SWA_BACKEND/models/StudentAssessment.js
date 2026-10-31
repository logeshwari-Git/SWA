const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    questionText: String,
    category: String,
    rating: Number
  },
  { _id: false }
);

const studentAssessmentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    dayNumber: { type: Number, required: true },
    assessmentNumber: { type: Number, required: true },
    answers: { type: [answerSchema], default: [] },
    assessmentDate: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentAssessment", studentAssessmentSchema);
