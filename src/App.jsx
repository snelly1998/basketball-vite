import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import LeagueHome from "./pages/LeagueHome";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "grey" }}>
        <Link to="/">Basketball Simulator</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:leagueId" element={<LeagueHome />} />
      </Routes>
    </Router>
  );
}
