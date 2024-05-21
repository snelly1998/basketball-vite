import React, { useState } from "react";
import { useLeagueContext } from "../../context/LeagueCreationContext";

const LeagueForm = () => {
  const [leagueName, setLeagueName] = useState("");
  const { addLeague } = useLeagueContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    addLeague(leagueName);
    setLeagueName(""); // Reset the form input
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={leagueName}
        onChange={(e) => setLeagueName(e.target.value)}
        placeholder="Enter league name"
      />
      <button type="submit">Create League</button>
    </form>
  );
};

export default LeagueForm;
