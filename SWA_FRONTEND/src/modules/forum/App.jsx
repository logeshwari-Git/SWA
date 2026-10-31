import React from "react";
import PostForm from "./components/PostForm.jsx";
import PostList from "./components/PostList.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h2>Share Your Thoughts ;)</h2>
      </header>

      <div className="container">
        <PostForm />
        <PostList />
      </div>
    </div>
  );
}

export default App;
