const express = require("express");
const DailyRisk = require("../models/DailyRisk");
const StudentAssessment = require("../models/StudentAssessment");
const User = require("../models/User");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

function getStudentLookupKeys(student) {
  return [
    student?.studentId,
    student?.username,
    student?._id ? String(student._id) : null
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

router.get("/", async (req, res) => {
  const counselors = await User.find({ role: "counselor" }).select("-password");
  res.json(counselors);
});

router.get("/dashboard", requireRole("counselor", "admin"), async (req, res) => {
  try {
    const risks = await DailyRisk.find().sort({ createdAt: -1 });
    const assessments = await StudentAssessment.find();
    const students = await User.find({ role: "student" }).select("studentId username name");
    const studentMap = new Map();

    students.forEach((student) => {
      getStudentLookupKeys(student).forEach((key) => {
        if (!studentMap.has(key)) {
          studentMap.set(key, student);
        }
      });
    });

    const accountLinkedRisks = risks.filter((risk) => studentMap.has(String(risk.studentId)));
    const totalStudents = new Set(accountLinkedRisks.map((risk) => String(risk.studentId))).size;
    const highRiskRecords = risks.filter((risk) =>
      studentMap.has(String(risk.studentId)) &&
      risk.assessment2Complete &&
      risk.counselorNotified &&
      risk.finalRiskLevel === "HIGH" &&
      !risk.hiddenFromCounselor
    );

    const mappedAnswers = {};
    assessments.forEach((assessment) => {
      const key = `${assessment.studentId}-${assessment.dayNumber}-${assessment.assessmentDate}`;
      if (!mappedAnswers[key]) {
        mappedAnswers[key] = { A1: [], A2: [] };
      }
      if (assessment.assessmentNumber === 1) {
        mappedAnswers[key].A1 = assessment.answers;
      } else {
        mappedAnswers[key].A2 = assessment.answers;
      }
    });

    const data = highRiskRecords.map((risk, index) => {
      const key = `${risk.studentId}-${risk.dayNumber}-${risk.assessmentDate}`;
      const answers = mappedAnswers[key] || { A1: [], A2: [] };
      const student = studentMap.get(String(risk.studentId));
      return {
        serialNo: index + 1,
        internalStudentId: String(risk.studentId),
        studentId: student?.studentId || student?.username || String(risk.studentId),
        studentName: student?.name || "",
        day: risk.dayNumber,
        date: risk.assessmentDate,
        initialRisk: risk.dailyRiskLevel,
        finalRisk: risk.finalRiskLevel,
        scores: {
          ghq: risk.ghqScore,
          who: risk.whoPercentage,
          phq: risk.phqScore,
          gad: risk.gadScore,
          mbi: risk.mbiScores
        },
        assessment1Answers: answers.A1,
        assessment2Answers: answers.A2
      };
    });

    res.json({
      totalStudents,
      highRisk: highRiskRecords.length,
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load counselor dashboard" });
  }
});

router.delete(
  "/delete/:studentId/:dayNumber/:date?",
  requireRole("counselor", "admin"),
  async (req, res) => {
    const { studentId, dayNumber, date } = req.params;
    const query = {
      studentId,
      dayNumber: Number(dayNumber),
      ...(date ? { assessmentDate: date } : {})
    };

    await DailyRisk.updateMany(query, {
      $set: { hiddenFromCounselor: true }
    });

    res.json({ success: true });
  }
);

module.exports = router;
