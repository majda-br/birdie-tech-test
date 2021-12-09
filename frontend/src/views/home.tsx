import React from 'react';
import Patients from '../components/patients';
import { usePrefetch } from '../utils';

const Home = () => {
  const [patients, _] = usePrefetch("/api/patients");

  return (
    <div className="app-row to-top">
      <Patients items={patients} />
    </div>
  );
};

export default Home;