import React from "react";
import LeagueList from "../cmp/leaguecreation/LeagueList";
import LeagueForm from "../cmp/leaguecreation/LeagueForm";
import { LeagueProvider } from "../context/LeagueCreationContext";

function Home() {
  return (
    <div>
      <LeagueProvider>
        <div>
          <LeagueForm />
          <LeagueList />
        </div>
      </LeagueProvider>
    </div>
  );
}

export default Home;
