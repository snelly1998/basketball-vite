import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TeamStats from "../cmp/leagueHome/TeamStats";
import Standings from "../cmp/leagueHome/Standings";
import UpcomingSchedule from "../cmp/leagueHome/UpcomingSchedule";
import { LeagueHomeProvider } from "../context/LeagueHomeContext";

const LeagueHome = () => {
  return (
    <div>
      <LeagueHomeProvider>
        <TeamStats />
        <Standings />
        <UpcomingSchedule />
      </LeagueHomeProvider>
    </div>
  );
};

export default LeagueHome;
