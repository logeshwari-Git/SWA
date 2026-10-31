require("dotenv").config();

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const SelfCare = require("./models/SelfCare");
const EMAQuestion = require("./models/EMAQuestion");
const MotivationQuote = require("./models/MotivationQuote");

const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const moodRoutes = require("./routes/moodRoutes");
const journalRoutes = require("./routes/journalRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const selfCareRoutes = require("./routes/selfCareRoutes");
const savedContentRoutes = require("./routes/savedContentRoutes");
const forumRoutes = require("./routes/forumRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const mongoose = require("mongoose");

const app = express();
const port = Number(process.env.PORT) || 5001;


function buildDefaultSelfCareCategories() {
  return [
    { name: "Happy", order: 1 },
    { name: "Sad", order: 2 },
    { name: "Stress", order: 3 },
    { name: "Relaxation", order: 4 },
    { name: "Breathing", order: 5 },
    { name: "Sleep", order: 6 },
    { name: "PCOD", order: 7 },
    { name: "Anxiety", order: 8 },
    { name: "Anger", order: 9 }
  ];
}

function buildDefaultSelfCareItems() {
  return [
    {title:"Smile Practice",category:"Happy",image:"/images/Smile_Practice.jpg",steps:["Stand in front of a mirror.","Smile gently for one minute.","Notice how your face and body feel."]},
{title:"Dance Break",category:"Happy",image:"/images/dance_break_happy.jpg",steps:["Play one favorite song.","Move freely for two to three minutes.","Pause and notice your energy."]},
{title:"Positive Affirmations",category:"Happy",image:"/images/positive_happy.jpg",steps:["Say three kind statements to yourself.","Repeat them aloud slowly.","Pick one line to remember today."]},
{title:"Watch Comedy",category:"Happy",image:"/images/watch_comedy_happy.jpg",steps:["Open a short funny clip.","Watch without multitasking.","Notice if your body feels lighter after it ends."]},
{title:"Color Therapy",category:"Happy",image:"/images/color_therapy_happy.jpg",steps:["Pick colors that feel bright and warm.","Color for ten minutes.","Let the activity stay playful, not perfect."]},
{title:"Music Boost",category:"Happy",image:"/images/music_boote_happy.jpg",steps:["Play an uplifting playlist.","Sit or walk while listening.","Choose the song that changes your mood most."]},
{title:"Release Sadness",category:"Sad",image:"/images/release sadness_sad.jpg",steps:["Give yourself permission to feel sad.","Take three soft breaths.","Write or say what is hurting right now."]},
{title:"Comfort Music",category:"Sad",image:"/images/comfort_music_sad.jpg",steps:["Choose music that feels safe.","Sit quietly and listen.","Let the song finish before checking your phone."]},
{title:"Comfort Breathing",category:"Sad",image:"/images/comfortable_breathing_sad.jpg",steps:["Inhale for four counts.","Exhale for six counts.","Repeat until your body softens a little."]},
{title:"Soft Music Therapy",category:"Sad",image:"/images/softmusictherapy_sad.webp",steps:["Put on soft instrumental music.","Close your eyes.","Focus on one sound at a time."]},
{title:"Self Hug",category:"Sad",image:"/images/self_hug_sad.jpg",steps:["Wrap your arms around yourself.","Take slow breaths.","Stay there for thirty seconds and soften your shoulders."]},
{title:"Talk to Friend",category:"Sad",image:"/images/talk to friend_sad.jpg",steps:["Message or call someone safe.","Tell them you need a small check-in.","Share honestly, even if briefly."]},
{title:"Gentle Walk",category:"Sad",image:"/images/gentle_walk_sad.jpg",steps:["Walk slowly for five to ten minutes.","Notice the sky, trees, or sounds.","Return without rushing yourself."]},
{title:"Stress Reset",category:"Stress",image:"/images/stress_resetstress.jpg",steps:["Stop what you are doing for one minute.","Breathe in slowly and unclench your jaw.","Pick just one next task."]},
{title:"Desk Stretch",category:"Stress",image:"/images/desk_strect_stress.jpg",steps:["Roll your shoulders back.","Stretch your neck gently.","Open and close your hands ten times."]},
{title:"Hydrate Break",category:"Stress",image:"/images/hydrated_break_stress.jpg",steps:["Drink a full glass of water.","Step away from your screen.","Take five deep breaths before returning."]},
{title:"Calm Body Scan",category:"Relaxation",image:"/images/calmbodyscan_relax.jpg",steps:["Close your eyes.","Relax each body part from head to toe.","Pause longer where you feel tension."]},
{title:"Nature Visualization",category:"Relaxation",image:"/images/nature_relaxation.jpg",steps:["Imagine a peaceful natural place.","Picture the colors and sounds.","Stay with that scene for two minutes."]},
{title:"Tea Pause",category:"Relaxation",image:"/images/tea_relax.webp",steps:["Make a warm drink.","Hold the cup with both hands.","Sip slowly without distractions."]},
{title:"4-7-8 Breathing",category:"Breathing",image:"/images/4-7-8-Breathing.webp",steps:["Inhale for 4 counts.","Hold for 7 counts.","Exhale slowly for 8 counts."]},
{title:"Box Breathing",category:"Breathing",image:"/images/box breathing_breath.jpg",steps:["Inhale for 4 counts.","Hold for 4 counts.","Exhale for 4 counts.","Hold for 4 counts."]},
{title:"Belly Breathing",category:"Breathing",image:"/images/bellybreathing_breathing.png",steps:["Place a hand on your stomach.","Breathe so your belly rises.","Exhale longer than you inhale."]},
{title:"Screen Off Ritual",category:"Sleep",image:"/images/screen0gg_sleep.jpg",steps:["Turn off bright screens.","Set an alarm now.","Keep the room quieter and darker."]},
{title:"Night Journal",category:"Sleep",image:"/images/night_journal_sleep.jpeg",steps:["Write down lingering thoughts.","Note one thing to do tomorrow.","Close the journal and let the day end."]},
{title:"Gentle Stretch",category:"PCOD",image:"/images/gentlestretch_pcod.avif",steps:["Do a short full-body stretch.","Move gently and breathe evenly.","Stop if anything feels painful."]},
{title:"Warm Water Sip",category:"PCOD",image:"/images/warm water_pcod.jpg",steps:["Prepare warm water.","Sip slowly.","Use the moment as a small reset."]},
{title:"Mood Care Note",category:"PCOD",image:"/images/mood_care_pcod.jpg",steps:["Write how your body feels today.","Note your energy and mood.","Choose one supportive action for yourself."]},
{title:"Safe Thought Note",category:"Anxiety",image:"/images/safe_tpught_anxety.jpg",steps:["Write one balanced thought.","Read it twice.","Return to it when your mind races."]},
{title:"Reach Out",category:"Anxiety",image:"/images/reachout_anxiety.jpg",steps:["Text someone you trust.","Say you feel anxious.","Ask for a brief grounding conversation."]},
{title:"Pause Before Reply",category:"Anger",image:"/images/pausereply_anger.jpg",steps:["Step away for one minute.","Breathe before responding.","Choose calmer words when you return."]},
{title:"Cooling Breath",category:"Anger",image:"/images/colling breathing_anger.avif",steps:["Inhale through your nose.","Exhale slowly as if cooling hot tea.","Repeat until your shoulders drop."]},
{title:"Water Break",category:"Anger",image:"/images/water break_anger.jpg",steps:["Drink water slowly.","Loosen your hands and jaw.","Delay the reaction until you feel steadier."]},
{title:"Shoulder Release",category:"Tesion",image:"/images/desk_strect_stress.jpg",steps:["Lift your shoulders up.","Drop them on the exhale.","Repeat ten times."]},
{title:"Neck Roll",category:"Tesion",image:"/images/desk_strect_stress.jpg",steps:["Tilt your head gently side to side.","Move slowly in a small circle.","Stop if you feel strain."]},
{title:"Jaw Release",category:"Tesion",image:"/images/desk_strect_stress.jpg",steps:["Unclench your jaw.","Massage the jaw joint softly.","Take three slow breaths."]},
  ];
}

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", authRoutes);
app.use("/api/student", assessmentRoutes);
app.use("/api/counselor", counselorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/selfcare", selfCareRoutes);
app.use("/api/saved", savedContentRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/posts", require("./routes/postRoutes"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

async function seedDefaults() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const counselorPassword = await bcrypt.hash("counselor123", 10);
  const users = [
    {
      name: "Admin User",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      password: adminPassword
    },
    {
      name: "Dr. Sarah Jenkins",
      username: "counselor1",
      email: "counselor1@example.com",
      role: "counselor",
      specialization: "Anxiety, Stress & Academic Burnout",
      department: "Student Health Center",
      password: counselorPassword
    },
    {
      name: "Dr. Rajesh Kumar",
      username: "counselor2",
      email: "counselor2@example.com",
      role: "counselor",
      specialization: "Depression & Emotional Wellness",
      department: "Student Counseling Center",
      password: counselorPassword
    }
  ];

  for (const userData of users) {
    const { password, ...fields } = userData;
    await User.findOneAndUpdate(
      { username: userData.username },
      { ...fields, password },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const defaultCategories = buildDefaultSelfCareCategories();
  for (const category of defaultCategories) {
    await Category.findOneAndUpdate(
      { name: category.name },
      { $set: { order: category.order } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const defaultSelfCareItems = buildDefaultSelfCareItems();
  for (const item of defaultSelfCareItems) {
    await SelfCare.findOneAndUpdate(
      { title: item.title, category: item.category },
      { $setOnInsert: item },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const questionCount = await EMAQuestion.countDocuments();
  if (questionCount === 0) {
    console.log("Seeding default EMA questions...");
    await EMAQuestion.insertMany(buildDefaultEMAQuestions());
    console.log("✅ Default EMA questions seeded");
  }

  const quoteCount = await MotivationQuote.countDocuments();
  if (quoteCount === 0) {
    console.log("Seeding default Motivation quotes...");
    await MotivationQuote.insertMany(buildDefaultQuotes());
    console.log("✅ Default Motivation quotes seeded");
  }
}

function buildDefaultEMAQuestions() {
  return [
    // WHO-5 Well-Being Index (basic)
    { questionText: "I have felt cheerful and in good spirits", category: "who5", difficulty: "basic", options: [0, 1, 2, 3, 4, 5], isActive: true },
    { questionText: "I have felt calm and relaxed", category: "who5", difficulty: "basic", options: [0, 1, 2, 3, 4, 5], isActive: true },
    { questionText: "I have felt active and vigorous", category: "who5", difficulty: "basic", options: [0, 1, 2, 3, 4, 5], isActive: true },
    { questionText: "I woke up feeling fresh and rested", category: "who5", difficulty: "basic", options: [0, 1, 2, 3, 4, 5], isActive: true },
    { questionText: "My daily life has been filled with things that interest me", category: "who5", difficulty: "basic", options: [0, 1, 2, 3, 4, 5], isActive: true },

    // GHQ-12 General Health Questionnaire (basic)
    { questionText: "Been able to concentrate on whatever you're doing?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Lost much sleep over worry?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Felt that you are playing a useful part in things?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Felt capable of making decisions about things?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Felt constantly under strain?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Felt you couldn't overcome your difficulties?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been able to enjoy your normal day-to-day activities?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been able to face up to your problems?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been feeling unhappy and depressed?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been losing confidence in yourself?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been thinking of yourself as a worthless person?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Been feeling reasonably happy, all things considered?", category: "ghq12", difficulty: "basic", options: [0, 1, 2, 3], isActive: true },

    // PHQ-9 (advanced)
    { questionText: "Little interest or pleasure in doing things", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Feeling down, depressed, or hopeless", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Trouble falling or staying asleep, or sleeping too much", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Feeling tired or having little energy", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Poor appetite or overeating", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Feeling bad about yourself — or that you are a failure", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Trouble concentrating on things, such as reading or school work", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Moving or speaking slowly, or being fidgety/restless", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Thoughts that you would be better off dead, or of hurting yourself", category: "phq9", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },

    // GAD-7 (advanced)
    { questionText: "Feeling nervous, anxious, or on edge", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Not being able to stop or control worrying", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Worrying too much about different things", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Trouble relaxing", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Being so restless that it's hard to sit still", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Becoming easily annoyed or irritable", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },
    { questionText: "Feeling afraid as if something awful might happen", category: "gad7", difficulty: "advanced", options: [0, 1, 2, 3], isActive: true },

    // MBI (Maslach Burnout Inventory - Student)
    { questionText: "I feel emotionally drained by my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I feel used up at the end of a day at university", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I feel tired when I get up in the morning and have to face another day", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "Studying or attending classes is really a strain for me", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I feel burned out from my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I have become less interested in my studies since my enrollment", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I have become less enthusiastic about my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I have become more cynical about the potential of my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I doubt the significance of my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I feel that what I am studying has lost its meaning", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I can effectively solve the problems that arise in my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I believe that I make an effective contribution to the classes that I attend", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "In my opinion, I am a good student", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I feel stimulated when I achieve my study goals", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true },
    { questionText: "I have learned many interesting things during the course of my studies", category: "mbi", difficulty: "advanced", options: [0, 1, 2, 3, 4, 5, 6], isActive: true }
  ];
}

function buildDefaultQuotes() {
  return [
    { message: "Keep up the great work! Maintain your positive habits and take care of yourself.", riskLevel: "LOW", isActive: true },
    { message: "Take a deep breath. Slow down, prioritize your well-being, and take short breaks today.", riskLevel: "MODERATE", isActive: true },
    { message: "You are not alone. Please reach out to your counselor or a trusted person for support.", riskLevel: "HIGH", isActive: true }
  ];
}

async function start() {
  await connectDB();

  await seedDefaults();

  try {
    await mongoose.connection.collection("users").dropIndex("anonymousName_1");
    console.log("✅ Dropped old anonymousName index");
  } catch (err) {
    console.log("");
  }

  const activePort = process.env.PORT || port || 5001;
  const serverInstance = app.listen(activePort, () => {
    console.log(`Backend running on port ${activePort}`);
  });
  serverInstance.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️  Port ${activePort} is already in use, skipped.`);
    } else {
      console.error(`Error on port ${activePort}:`, err.message);
    }
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

module.exports = app;
