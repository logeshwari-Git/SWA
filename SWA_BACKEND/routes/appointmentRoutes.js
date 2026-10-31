const express = require("express");
const Appointment = require("../models/Appointment");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

const TIME_SLOTS = [
  "08:00 - 08:50 AM",
  "09:00 - 09:50 AM",
  "10:00 - 10:50 AM",
  "11:00 - 11:50 AM",
  "12:00 - 12:50 PM",
  "14:00 - 14:50 PM"
];

function getEffectiveStudentId(userLike) {
  if (!userLike) return null;
  return String(userLike.studentId || userLike.username || userLike.id || userLike._id || "");
}

// Endpoint to fetch the standard 6 counseling session slots
router.get("/slots", (req, res) => {
  res.json(TIME_SLOTS);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { counselorId, date, slot } = req.body;

    if (!counselorId || !date || !slot) {
      return res.status(400).json({ message: "Counselor, date, and slot are required" });
    }

    // Check if slot is already booked for this counselor on this date
    const existing = await Appointment.findOne({
      counselorId,
      date,
      slot,
      status: { $in: ["Pending", "Confirmed", "Reschedule Requested"] }
    });

    if (existing) {
      return res.status(409).json({
        message: `This slot (${slot}) is already booked for this counselor on ${date}. Please choose another slot.`
      });
    }

    const effectiveStudentId =
      req.user?.role === "student" ? getEffectiveStudentId(req.user) : (req.body.studentId || null);

    const appointment = await Appointment.create({
      ...req.body,
      studentId: effectiveStudentId,
      counselorNotified: true
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

router.get("/booked-slots", async (req, res) => {
  try {
    const { counselorId, date } = req.query;
    if (!counselorId || !date) {
      return res.json([]);
    }

    const activeAppointments = await Appointment.find({
      counselorId,
      date,
      status: { $in: ["Pending", "Confirmed", "Reschedule Requested"] }
    });
    res.json(activeAppointments.map((appointment) => appointment.slot));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booked slots" });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  const studentId = getEffectiveStudentId(req.user);
  if (req.user?.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointments = await Appointment.find({ studentId })
    .sort({ createdAt: -1 })
    .populate("counselorId", "name email specialization");

  res.json(appointments);
});

router.get("/counselor/:id", requireRole("counselor", "admin"), async (req, res) => {
  const counselorId = req.user?.role === "counselor" ? req.user.id : req.params.id;
  const appointments = await Appointment.find({ counselorId }).populate(
    "counselorId",
    "name email specialization"
  );
  res.json(appointments);
});

router.get("/:id", requireAuth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    "counselorId",
    "name email specialization"
  );
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (req.user?.role === "student") {
    const studentId = getEffectiveStudentId(req.user);
    if (String(appointment.studentId) !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  if (req.user?.role === "counselor") {
    if (String(appointment.counselorId?._id || appointment.counselorId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  res.json(appointment);
});

router.put("/accept/:id", requireRole("counselor", "admin"), async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, { status: "Confirmed" });
  res.json({ success: true });
});

router.put("/reject/:id", requireRole("counselor", "admin"), async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, { status: "Rejected" });
  res.json({ success: true });
});

router.put("/request-reschedule/:id", requireRole("counselor", "admin"), async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "Reschedule Requested"
  });
  res.json({ success: true });
});

router.put("/reschedule/:id", requireAuth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (req.user?.role === "student") {
    const studentId = getEffectiveStudentId(req.user);
    if (String(appointment.studentId) !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  const targetDate = req.body.date || appointment.date;
  const targetSlot = req.body.slot || appointment.slot;

  // Check if slot is already booked for this counselor on that date
  const conflict = await Appointment.findOne({
    _id: { $ne: req.params.id },
    counselorId: appointment.counselorId,
    date: targetDate,
    slot: targetSlot,
    status: { $in: ["Pending", "Confirmed", "Reschedule Requested"] }
  });

  if (conflict) {
    return res.status(409).json({
      message: `The slot (${targetSlot}) on ${targetDate} is already booked for this counselor.`
    });
  }

  await Appointment.findByIdAndUpdate(req.params.id, {
    date: targetDate,
    slot: targetSlot,
    status: "Pending"
  });
  res.json({ success: true });
});

router.put("/complete/:id", requireRole("counselor", "admin"), async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "Completed",
    remarks: req.body.remarks || ""
  });
  res.json({ success: true });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (req.user?.role === "student") {
    const studentId = getEffectiveStudentId(req.user);
    if (String(appointment.studentId) !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  if (req.user?.role === "counselor") {
    if (String(appointment.counselorId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  await Appointment.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
  res.json({ success: true });
});

// POST - Send message on appointment
router.post("/:id/message", requireAuth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  // Verify user has access to this appointment
  const studentId = getEffectiveStudentId(req.user);
  const isStudent = String(appointment.studentId) === studentId && req.user?.role === "student";
  const isCounselor = String(appointment.counselorId) === String(req.user.id) && req.user?.role === "counselor";
  const isAdmin = req.user?.role === "admin";

  if (!isStudent && !isCounselor && !isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  const message = {
    sender: req.user?.role === "student" ? "student" : "counselor",
    senderName: req.body.senderName || req.user?.name || "User",
    text: req.body.text,
    timestamp: new Date()
  };

  appointment.messages.push(message);
  await appointment.save();
  res.status(201).json(appointment);
});

// GET - Retrieve messages for appointment
router.get("/:id/messages", requireAuth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  // Verify user has access
  const studentId = getEffectiveStudentId(req.user);
  const isStudent = String(appointment.studentId) === studentId && req.user?.role === "student";
  const isCounselor = String(appointment.counselorId) === String(req.user.id) && req.user?.role === "counselor";
  const isAdmin = req.user?.role === "admin";

  if (!isStudent && !isCounselor && !isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(appointment.messages || []);
});

// PUT - Counselor accepts the rescheduled appointment
router.put("/accept-reschedule/:id", requireRole("counselor", "admin"), async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  // Update appointment with counselor's suggested date and slot, status to Pending (waiting for student to accept)
  await Appointment.findByIdAndUpdate(req.params.id, {
    counselorSuggestedDate: req.body.date,
    counselorSuggestedSlot: req.body.slot,
    status: "Reschedule Requested"
  });

  res.json({ success: true });
});

module.exports = router;
