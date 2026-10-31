import { useState } from "react";

import SplashScreen from "./components/SplashScreen";
import ModuleGrid from "./components/ModuleGrid";

import Home from "./components/Home";
import Assessment from "./components/Assessment";
import Selfcare from "./components/Selfcare";
import Forum from "./components/Forum";
import Chatbot from "./components/Chatbot";
import Crisis from "./components/Crisis";

import AdminAddQuestion from "./components/AdminAddQuestion";
import AdminQuestionList from "./components/AdminQuestionList";
import AdminAddQuote from "./components/AdminAddQuote";
import AdminQuoteList from "./components/AdminQuoteList";

import Counselor from "./components/Counselor";

import MoodTracker from "./modules/mood-journal/MoodTracker";
import MoodHistory from "./modules/mood-journal/MoodHistory";
import JournalEntry from "./modules/mood-journal/JournalEntry";
import JournalHistory from "./modules/mood-journal/JournalHistory";
import CalendarView from "./modules/mood-journal/CalendarView";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [page, setPage] = useState("grid");
  const [adminTab, setAdminTab] = useState("menu");

  const studentId = "student123";

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
console.log("Current Page:", page);

  return (
    <div className="app-container">
      <h3>Current Page: {page}</h3>
      {page === "grid" && <ModuleGrid onNavigate={setPage} />}

      {page === "home" && <Home onBack={() => setPage("grid")} />}

      {page === "assessment" && (
        <Assessment
          onBack={() => setPage("grid")}
          studentId={studentId}
        />
      )}

      {page === "selfcare" && <Selfcare onBack={() => setPage("grid")} />}
      {page === "forum" && <Forum onBack={() => setPage("grid")} />}
      {page === "chatbot" && <Chatbot onBack={() => setPage("grid")} />}
      {page === "crisis" && <Crisis onBack={() => setPage("grid")} />}
      {page === "counselor" && <Counselor onBack={() => setPage("grid")} />}



      {page === "moodJournal" && (
        <div className="module-container">
          <button className="back-btn" onClick={() => setPage("grid")}>Back</button>
          <h2>Mood Tracking & Journal</h2>

          <div className="module-grid">
            <div className="card" onClick={() => setPage("mood")}>Mood Tracker</div>
            <div className="card" onClick={() => setPage("moodHistory")}>Mood History</div>
            <div className="card" onClick={() => setPage("journalEntry")}>Journal Entry</div>
            <div className="card" onClick={() => setPage("journalHistory")}>Journal History</div>
            <div className="card" onClick={() => setPage("calendar")}>Calendar View</div>
          </div>
        </div>
      )}
      {page === "mood" && (
        <MoodTracker onBack={() => setPage("moodJournal")} />
      )}

      {page === "moodHistory" && (
        <MoodHistory onBack={() => setPage("moodJournal")} />
      )}

      {page === "journalEntry" && (
        <JournalEntry onBack={() => setPage("moodJournal")} />
      )}

      {page === "journalHistory" && (
        <JournalHistory onBack={() => setPage("moodJournal")} />
      )}

      {page === "calendar" && (
        <CalendarView onBack={() => setPage("moodJournal")} />
      )}


      {page === "admin" && (
        <div className="admin-container">
          <button
            className="back-btn"
            onClick={() => {
              setPage("grid");
              setAdminTab("menu");
            }}
          >
            Back
          </button>

          <h2 className="admin-title">Admin Dashboard</h2>

          {adminTab === "menu" && (
            <div className="admin-menu">
              <button onClick={() => setAdminTab("addQ")}>Add Questions</button>
              <button onClick={() => setAdminTab("manageQ")}>Manage Questions</button>
              <button onClick={() => setAdminTab("addQuote")}>Add Quotes</button>
              <button onClick={() => setAdminTab("manageQuote")}>Manage Quotes</button>
            </div>
          )}

          {adminTab !== "menu" && (
            <button
              className="back-btn"
              onClick={() => setAdminTab("menu")}
            >
              Back
            </button>
          )}

          {adminTab === "addQ" && <AdminAddQuestion />}
          {adminTab === "manageQ" && <AdminQuestionList />}
          {adminTab === "addQuote" && <AdminAddQuote />}
          {adminTab === "manageQuote" && <AdminQuoteList />}
        </div>
      )}
    </div>
  );
}

export default App;
