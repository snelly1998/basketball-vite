import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const LeagueHomeContext = createContext();

export const useLeagueHomeContext = () => useContext(LeagueHomeContext);

export const LeagueHomeProvider = ({ children }) => {
  const { leagueId } = useParams();

  useEffect(() => {
    getDb(leagueId);
  }, [leagueId]);
  const getDb = async (leagueId) => {
    try {
      const request = await indexedDB.open(leagueId);
      request.onsuccess = (event) => {
        const db = event.target.result;
        console.log(db);
      };
      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event.target.error);
      };
    } catch (error) {
      console.error("Error opening IndexedDB:", error);
    }
  };
  return (
    <LeagueHomeContext.Provider value={{ getDb }}>
      {children}
    </LeagueHomeContext.Provider>
  );
};

export default LeagueHomeContext;
