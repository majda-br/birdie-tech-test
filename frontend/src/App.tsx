import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/navbar';
import './styles/app.css';
import { AppProvider } from './appContext';
import Home from "./views/home";
import PatientHistory from './views/patientHistory';


const App = () => {
  return (
    <div className="App">
      <Navbar />
      <AppProvider>
        <div className="app-container">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patient-history" element={<PatientHistory />} />
            </Routes>
          </Router>
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
