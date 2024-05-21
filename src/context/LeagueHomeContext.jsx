import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const LeagueHomeContext = createContext();

export const useLeagueHomeContext = () => useContext(LeagueHomeContext);

export const LeagueHomeProvider = ({ children }) => {
  const { leagueId } = useParams();

  useEffect(() => {
    const getDb = async (leagueId) => {
      try {
        const request = await indexedDB.open(leagueId);
        request.onsuccess = (event) => {
          const db = event.target.result;
        };
        request.onerror = (event) => {
          console.error("Error opening IndexedDB:", event.target.error);
        };
      } catch (error) {
        console.error("Error opening IndexedDB:", error);
      }
    };

    getDb(leagueId);
  }, [leagueId]);

  return (
    <LeagueHomeContext.Provider value={{}}>
      {children}
    </LeagueHomeContext.Provider>
  );
};

export default LeagueHomeContext;
