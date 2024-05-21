import React, { createContext, useContext, useState, useEffect } from "react";

const LeagueContext = createContext();

export const useLeagueContext = () => useContext(LeagueContext);

export const LeagueProvider = ({ children }) => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    loadLeagues();
  }, []);
  const rotateArray = (array, offset) => {
    for (let i = 0; i < offset; i++) {
      array.unshift(array.pop());
    }
    return array;
  };
  const loadLeagues = async () => {
    const leagues = await indexedDB.databases();
    const list = await Promise.all(
      leagues.map((league) => {
        // Assuming you have a way to extract league name from database name
        return league.name;
      })
    );
    setLeagues(list);
  };

  const addLeague = async (leagueName) => {
    const request = await window.indexedDB.open(`LeagueDB_${leagueName}`);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create an object store for 'teams' with auto-incrementing keyPath
      const teamsStore = db.createObjectStore("teams", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Create an index for team names for efficient querying
      teamsStore.createIndex("teamName", "teamName", { unique: true });
      teamsStore.createIndex("conference", "conference", { unique: false });
      const playersStore = db.createObjectStore("players", {
        keyPath: "id",
        autoIncrement: true,
      });

      playersStore.createIndex("playerName", "playerName", { unique: false });
      playersStore.createIndex("ovr", "ovr", { unique: false });
      playersStore.createIndex("teamId", "teamId", { unique: false });
      playersStore.createIndex("gp", "gp", { unique: false });
      playersStore.createIndex("points", "points", { unique: false });

      const scheduleStore = db.createObjectStore("schedule", {
        keyPath: "id",
        autoIncrement: true,
      });
      scheduleStore.createIndex("day", "day", { unique: false });

      scheduleStore.createIndex("homeId", "homeId", { unique: false });
      scheduleStore.createIndex("homeScore", "homeScore", { unique: false });
      scheduleStore.createIndex("awayId", "awayId", { unique: false });
      scheduleStore.createIndex("awayScore", "awayScore", { unique: false });
    };
    await createTeams(`LeagueDB_${leagueName}`);
    await createSchedule(`LeagueDB_${leagueName}`);
    await loadLeagues(); // Reload leagues after adding a new one
  };
  const createTeams = async (leagueName) => {
    const teamsData = [];
    // Create teams for conference 1
    for (let i = 1; i <= 15; i++) {
      teamsData.push({
        teamName: `Team ${i}`,
        conference: 1,
      });
    }
    // Create teams for conference 2
    for (let i = 16; i <= 30; i++) {
      teamsData.push({
        teamName: `Team ${i}`,
        conference: 2,
      });
    }
    const request = await window.indexedDB.open(leagueName);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["teams"], "readwrite");
      const store = transaction.objectStore("teams");

      teamsData.forEach((team) => {
        const request = store.add(team);
        request.onsuccess = () => {
          console.log(`Team ${team.teamName} added successfully.`);
        };
        request.onerror = (event) => {
          console.error(
            `Failed to add team ${team.teamName}:`,
            event.target.error
          );
        };
      });

      transaction.oncomplete = () => {
        console.log("All teams added successfully.");
      };
      transaction.onerror = (event) => {
        console.error("Transaction failed:", event.target.error);
      };
    };
  };

  const createSchedule = async (leagueName) => {
    const scheduleData = [];
    // Create a basic schedule (round-robin)
    const teams = await getAllTeams(leagueName);

    for (let i = 0; i < 82; i++) {
      //NUMBER OF games  through
      for (let j = 0; j < teams.length; j++) {
        if (j % 2 === 0) {
          scheduleData.push({
            homeId: teams[j].id,
            awayId: teams[j + 1].id,
            day: i,
          });
        } else {
        }
      }
      rotateArray(teams, 1);
      let copy = teams[1];
      teams[1] = teams[0];
      teams[0] = copy;
    }

    const request = await window.indexedDB.open(leagueName);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["schedule"], "readwrite");
      const store = transaction.objectStore("schedule");

      scheduleData.forEach((game, index) => {
        const request = store.add(game);
        request.onsuccess = () => {
          console.log(`Game ${index + 1} added successfully.`);
        };
        request.onerror = (event) => {
          console.error(`Failed to add game ${index + 1}:`, event.target.error);
        };
      });

      transaction.oncomplete = () => {
        console.log("Schedule created successfully.");
      };
      transaction.onerror = (event) => {
        console.error("Transaction failed:", event.target.error);
      };
    };
  };
  const getAllTeams = async (leagueName) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(leagueName);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["teams"], "readonly");
        const store = transaction.objectStore("teams");
        const teams = [];

        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            teams.push(cursor.value);
            cursor.continue();
          } else {
            resolve(teams);
          }
        };

        cursorRequest.onerror = (event) => {
          console.error("Failed to fetch teams:", event.target.error);
          reject(event.target.error);
        };
      };

      request.onerror = (event) => {
        console.error("Failed to open database:", event.target.error);
        reject(event.target.error);
      };
    });
  };
  const deleteLeague = async (leagueName) => {
    // Implementation of deleting a league from IndexedDB
    await indexedDB.deleteDatabase(leagueName);
    await loadLeagues();
  };

  return (
    <LeagueContext.Provider
      value={{ leagues, addLeague, deleteLeague, loadLeagues }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export default LeagueContext;
