import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import Patient from './cards';

interface PatientsProps {
  items: string[],
}

const Patients = (props: PatientsProps) => {
  const { currentPatientId } = useContext(AppContext);

  return (
    <React.Fragment>
      {props.items.map((id: string) => (
        <Patient key={id} id={id} tag="" active={id === currentPatientId} />
      ))}
    </React.Fragment>
  );
};

export default Patients;