import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import './timeline.css';
import './popup.css';
import { DownOutlined,
  UpOutlined,
  CalendarOutlined,
  UserOutlined } from '@ant-design/icons' 
import { EVENT_TYPES, PAYLOAD_TYPES } from '../helpers/constants';

interface TimelineProps {
  data: {
    [index: string]: any[]
  }
}

// the popup that show up when we click on an event of a visit
// gives details about the event.
const EventDetailsPopup = ({open, closeModal, event}: any) => {
  // attributes of the events not to show in the popups
  const eventAttributesToHide = [
    'visit_id',
    'care_recipient_id',
    'timestamp',
    'event_type',
    'task_instance_id',
    'task_schedule_id',
    'task_definition_id',
    'alert_id',
    'observation_event_id',
    'medication_schedule_id'
];

  return (
  <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
        {event && (<>
          <div className="header">
            {/* Title with the event type and date */}
            <span>{EVENT_TYPES[event.event_type as keyof typeof EVENT_TYPES]}</span> 
            <span>{moment(event.timestamp).format('LLLL')}</span>
          </div>
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="content">
            {/* Popup's content with the velerant attributes of the event */}
          {Object.entries(event?.payload).map(([key, value]: [string, any]) => {
            if(typeof value === "string" && value && !eventAttributesToHide.includes(key)) {
              return (<p key={key+value}>
                <strong>{PAYLOAD_TYPES[key as keyof typeof PAYLOAD_TYPES]}:</strong> {value}.</p>)
            }
            return null;
          })}
          </div>
          </>)}
        </div>
      </Popup>
      )
}

// a timeline card
const TimelineItem = ({ data }: any) => {
  const [itemData, setItemData] = useState<any[]>(data);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    setItemData(data)
  }, [data])

  const [showEvents, setShowEvents] = useState(false);
  const setEventsVisibility = () => {
    setShowEvents(!showEvents);
  };
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [visitId, events] = itemData;

  return (
  <div className="timeline-item">
      <div className="timeline-item-content">
        {/* general information about the visit */}
        <time>{moment(events.slice(-1)[0].timestamp).format('LLL')}</time>
        <span><CalendarOutlined /> <strong>Visit ID:</strong> {visitId}</span>
        <span><UserOutlined /> <strong>Care giver ID:</strong> 
        {events[0].caregiver_id}</span>
        {/* we can unfold the card to show all the events of a visit */}
          { showEvents && (
            <>
            <EventDetailsPopup open={open} closeModal={closeModal} 
                  event={event}></EventDetailsPopup>
            <strong className="timeline-content-details-title">
              The events of the visit:</strong>
            <ul>
              {events.map((event: any) => {
                return (
                <div key={event.id}>
                  {/* you can click on each event to show a popup with more details */}
                  <li className="event"
                  onClick={() => {
                    setOpen(o => !o);
                    setEvent(event);
                    }}>
                    {moment(event.timestamp).format('LT')} - 
                  {EVENT_TYPES[event.event_type as keyof typeof EVENT_TYPES]}.
                  </li>
                </div>
              )})}
            </ul>
          </>)}
          {showEvents ? <UpOutlined className="chevron" 
          onClick={setEventsVisibility} /> :
              <DownOutlined className="chevron" 
              onClick={setEventsVisibility} />}
        <span className="circle" />
      </div>
  </div>
)}

// the timeline component
const Timeline = (props: TimelineProps) => {
  const [timeLineData, setTimeLineData] = useState<any[]>([]);

  useEffect(() => {
    const visitsData =  Object.entries(props.data);
    setTimeLineData(visitsData)
  }, [props.data])

  return (
    <>
    {timeLineData.length > 0 && (
        <div className="timeline-container">
          {/* there is a card for each visit */}
            {timeLineData.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    )}
    </>);
};

export default Timeline;