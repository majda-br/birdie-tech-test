import { UserOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import MoodGraph from '../components/moodGraph';
import Timeline from '../components/timeline';
import { useDynamicPrefetch } from '../utils';


const PatientHistory = () => {
  const { currentPatientId } = useContext(AppContext);
  // data structure: 
  // history is an Object with:
  // - visits ids as a key and
  // - an array of the visit's corresponding events as a value
  const [history, __] = useDynamicPrefetch(`/api/history?id=${currentPatientId}`, [currentPatientId]);

  return (
    <>
      <div className="patient-id"><UserOutlined /> <strong>Patient:</strong><br/> {currentPatientId}</div>
      <h3>Mood report</h3>
      <MoodGraph />
      <hr></hr>
      <h3>Timeline of the visits</h3>
      <Timeline data={history} />
    </>
  );
};

export default PatientHistory;