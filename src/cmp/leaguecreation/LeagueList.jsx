import React, { useEffect } from "react";
import { useLeagueContext } from "../../context/LeagueCreationContext";
import { Link } from "react-router-dom";

const LeagueList = () => {
  const { leagues, deleteLeague, loadLeagues } = useLeagueContext();

  useEffect(() => {
    loadLeagues();
  });
  return (
    <div>
      <h2>Leagues</h2>
      <ul>
        {leagues
          .filter((league) => league !== "firebaseLocalStorageDb")
          .map((league) => (
            <li key={league}>
              {league}
              <button>
                <Link to={league}>league</Link>
              </button>
              <button onClick={() => deleteLeague(league)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LeagueList;
