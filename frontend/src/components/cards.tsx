import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import { useNavigate } from "react-router-dom";

interface PatientProps {
  id: string;
  tag: string;
  active: boolean;
}

export const Patient = (props: PatientProps) => {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const onPatientClick = () => {
    ctx.setCurrentPatientId(props.id);
    navigate("/patient-history");
  }

  return (
    <div className="card-wrapper" onClick={onPatientClick}>
      <div className="card-sidebar">
        <img src="/user.png" alt="User icon" />
      </div>
      <div className="card-content">
        <div className="card-name-display">
          <strong>ID:</strong> {props.id}
        </div>
        <div className="card-desc">
          Some small description
        </div>
        <div className={`card-tag ${props.tag}`}>
        <div className="tag-bullet" /> Action needed
        </div>
      </div>
    </div>
  );
};

export default Patient;