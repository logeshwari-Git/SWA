const express = require("express");
const router = express.Router();

const EMAQuestion = require("../models/EMAQuestion");
const StudentAssessment = require("../models/StudentAssessment");
const DailyRisk = require("../models/DailyRisk");
const MotivationQuote = require("../models/MotivationQuote");
const { requireAuth } = require("../middleware/auth");

function getTodayString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

async function getQuoteForRisk(riskLevel) {
  const quote = await MotivationQuote.findOne({
    riskLevel: String(riskLevel || "").trim().toUpperCase(),
    isActive: true
  }).sort({ createdAt: -1 });

  return quote?.message || `Your risk level is ${riskLevel}`;
}

function getEffectiveStudentId(userLike) {
  if (!userLike) return null;
  return String(userLike.studentId || userLike.username || userLike.id || userLike._id || "");
}

function resolveRequestedStudentId(req) {
  const requested = req.params.studentId || req.body.studentId;
  const authStudentId = getEffectiveStudentId(req.user);

  if (req.user?.role === "student") {
    return authStudentId;
  }

  return requested || authStudentId;
}

router.get("/next-assessment/:studentId", requireAuth, async (req, res) => {
  try {
    const studentId = resolveRequestedStudentId(req);
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const today = getTodayString();

    const last = await StudentAssessment.findOne({ studentId }).sort({ createdAt: -1 });

    const todayRisk = await DailyRisk.findOne({
      studentId,
      assessmentDate: today
    });

    if (
      todayRisk &&
      todayRisk.dailyRiskLevel === "HIGH" &&
      !todayRisk.assessment2Complete
    ) {
      const questions = await EMAQuestion.find({
        category: { $in: ["phq9", "gad7", "mbi"] },
        isActive: true
      });

      return res.json({
        dayNumber: todayRisk.dayNumber,
        assessmentNumber: 2,
        questions
      });
    }

    if (
      todayRisk &&
      todayRisk.assessment1Complete &&
      (
        todayRisk.assessment2Complete ||
        todayRisk.dailyRiskLevel === "LOW" ||
        todayRisk.dailyRiskLevel === "MODERATE"
      )
    ) {
      return res.json({ completedToday: true });
    }

    let day = 1;

    if (last) {
      if (last.assessmentDate === today) {
        day = last.dayNumber;
      } else {
        day = last.dayNumber + 1;
      }
    }

    const questions = await EMAQuestion.find({
      category: { $in: ["who5", "ghq12"] },
      isActive: true
    });

    res.json({
      dayNumber: day,
      assessmentNumber: 1,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading assessment" });
  }
});

router.post("/submit-assessment", requireAuth, async (req, res) => {
  try {
    const studentId = resolveRequestedStudentId(req);
    const { dayNumber, assessmentNumber, answers } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const today = getTodayString();

    console.log("SUBMIT:", studentId, dayNumber, assessmentNumber);

    await StudentAssessment.create({
      studentId,
      dayNumber,
      assessmentNumber,
      answers,
      assessmentDate: today
    });

    let riskLevel;
    let quote = null;
    let goToAdvanced = false;

    if (assessmentNumber === 1) {
      const who = answers.filter((a) => a.category === "who5").map((a) => a.rating);
      const ghq = answers.filter((a) => a.category === "ghq12").map((a) => a.rating);

      const ghqScore = ghq.reduce((s, r) => (r >= 3 ? s + 1 : s), 0);
      const whoScore = Math.round(who.reduce((s, r) => s + r, 0) * 4);

      if (ghqScore < 3 && whoScore >= 50) riskLevel = "LOW";
      else if (ghqScore >= 5) riskLevel = "HIGH";
      else riskLevel = "MODERATE";

      await DailyRisk.findOneAndUpdate(
        { studentId, dayNumber, assessmentDate: today },
        {
          ghqScore,
          whoPercentage: whoScore,
          dailyRiskLevel: riskLevel,
          finalRiskLevel: riskLevel,
          assessment1Complete: true,
          assessment2Complete: false
        },
        { upsert: true }
      );

      quote = await getQuoteForRisk(riskLevel);

      if (riskLevel === "HIGH") {
        goToAdvanced = true;
      }
    } else {
      const phq = answers.filter((a) => a.category === "phq9").map((a) => a.rating);
      const gad = answers.filter((a) => a.category === "gad7").map((a) => a.rating);
      const mbi = answers.filter((a) => a.category === "mbi").map((a) => a.rating);

      const phqScore = phq.reduce((s, r) => s + Math.min(r, 3), 0);
      const gadScore = gad.reduce((s, r) => s + Math.min(r, 3), 0);

      const mbiScores = {
        exhaustion: mbi.slice(0, 5).reduce((s, r) => s + r, 0) / 5,
        cynicism: mbi.slice(5, 10).reduce((s, r) => s + r, 0) / 5,
        efficacy: mbi.slice(10).reduce((s, r) => s + r, 0) / 5
      };

      if (phqScore >= 15 || gadScore >= 15 || mbiScores.exhaustion >= 3.5) {
        riskLevel = "HIGH";
      } else if (phqScore >= 10 || gadScore >= 10) {
        riskLevel = "MODERATE";
      } else {
        riskLevel = "LOW";
      }

      await DailyRisk.findOneAndUpdate(
        { studentId, dayNumber, assessmentDate: today },
        {
          phqScore,
          gadScore,
          mbiScores,
          finalRiskLevel: riskLevel,
          assessment2Complete: true,
          counselorNotified: riskLevel === "HIGH"
        },
        { upsert: true }
      );

      quote = await getQuoteForRisk(riskLevel);
    }

    res.json({
      success: true,
      riskLevel,
      quote,
      goToAdvanced,
      completed: true
    });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({ message: "Submit error" });
  }
});

module.exports = router;
