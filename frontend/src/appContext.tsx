import React, { useContext, useState, useEffect } from "react";

export const AppContext = React.createContext({
  currentPatientId: "",
  setCurrentPatientId: (patientId: string) => {

  }
});

export const usePatient = (patientId: string): void => {
  const { setCurrentPatientId } = useContext(AppContext);

  useEffect(() => setCurrentPatientId(patientId));
};

interface AppProviderProps {
  children: React.ReactElement
}

export const AppProvider = (props: AppProviderProps) => {
  const [currentPatientId, setCurrentPatientId] = 
  useState(localStorage.getItem('currentPatientId') || '');

  useEffect(()=> {
    localStorage.setItem('currentPatientId', currentPatientId);
  }, [currentPatientId])
  
  return (
    <AppContext.Provider value={{ currentPatientId, setCurrentPatientId}}>
      {props.children}
    </AppContext.Provider>
  );
};