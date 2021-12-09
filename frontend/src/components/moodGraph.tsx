import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../appContext';
import { PATIENT_MOOD } from '../helpers/constants';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line, Bar } from 'react-chartjs-2';
import moment from 'moment';
import './moodGraph.css'
import axios from 'axios';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const LastMonthMood = () => {
    const { currentPatientId } = useContext(AppContext);
    // moodsObservations is an array containing 2 arrays : 
    // - one containing the values of the mood of the patient (sorted by timestamp asc),
    // - another containing the relative timestanmps.
    const [moodsObservations, setMoodsObservations] = useState<string[][]>([]);
    const [filtredTimes, setFiltredTimes] = useState<string[]>([]);
    const [filtredMoods, setFiltredMoods] = useState<number[]>([]);

    useEffect(() => {
        axios.get(`/api/patients/mood_history/?id=${currentPatientId}`)
        .then(res => {
            setMoodsObservations(res.data);
        })
    }, [currentPatientId]);

    useEffect(() => {
        const [rawMoods, timestamps] = moodsObservations;
        // getting the last month where a mood was recorded
        const lastMonthRecorded = moment(timestamps?.slice(-1)[0]);
        // getting all the timestamps that are included in the last month
        const times = timestamps?.filter((time: string) => moment(time).isSame(lastMonthRecorded, 'month'))
        ?.map((time: string) => moment(time).format('llll'))
        setFiltredTimes(times);
        // getting the coresponding moods
        // happy -> 100%, okay -> 50%, sad -> 0%
        const moods = rawMoods?.map((mood: string) => 
        PATIENT_MOOD[mood as keyof typeof PATIENT_MOOD]);
        setFiltredMoods(moods?.slice(-times.length));

    }, [moodsObservations])

    return (
      <Line
          className="graph"
          data={{
            labels: filtredTimes,
            datasets: [
              {
                label: 'Mood percentage',
                fill: false,
                backgroundColor: '#52a5ff',
                borderColor: '#0459b4',
                borderWidth: 2,
                data: filtredMoods
              }
            ]
          }}
           options={{
            plugins: {
                title: {
                  display: true,
                  text: "Last month mood evolution"
                },
                legend: {
                  display: true,
                  position: "bottom"
               }
              },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    suggestedMax: 100
                }
            }
          }} 
        /> );
}

const MonthlyMood = () => {
    const { currentPatientId } = useContext(AppContext);
    // moodsObservations is an array containing 2 arrays : 
    // - one containing the values of the mood of the patient (sorted by timestamp asc),
    // - another containing the relative timestanmps.
    const [moodsObservations, setMoodsObservations] = useState<string[][]>([])
    const [avgMoods, setAvgMoods] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);

    useEffect(() => {
        axios.get(`/api/patients/mood_history/?id=${currentPatientId}`)
        .then(res => {
            setMoodsObservations(res.data);
        })
    }, [currentPatientId]);

    useEffect(()=> {
        const [rawMoods, timestamps] = moodsObservations;
        const moods = rawMoods?.map((mood: string) => 
        PATIENT_MOOD[mood as keyof typeof PATIENT_MOOD]);
    
            let monthlyAverageMood: number[] = [];
            let times: string[] = [];
            let currTime: string = timestamps? timestamps[0]: '';
            let sumMoodOftheMonth: number = 0;
            let nbOfValuesOfTheMonth: number = 0;
            let datePostition: number = 0;
        
            // This while loop computes:
            // - months: array that contains the months where we recorded the patient's mood, 
            // - avgMoods: array containing the mean value of the mood of the corresponding months.
            while(datePostition < timestamps?.length) {
                // case where the date is the last value of the array timestamps 
                // and that this date is not in the same month as the previous value.
                if (datePostition === timestamps?.length-1 &&
                    !moment(timestamps?.slice(datePostition)[0]).isSame(currTime, 'month')) {
                    times.push(currTime);
                    monthlyAverageMood.push(sumMoodOftheMonth / nbOfValuesOfTheMonth);
                    times.push(timestamps?.slice(datePostition)[0]);
                    monthlyAverageMood.push(moods[timestamps?.length-1]);
                    datePostition+=1;
                    setAvgMoods(monthlyAverageMood);
                    const monthsGraph = times?.map(time => moment(time).format('MMMM'));
                    setMonths(monthsGraph);
                }
                // case where the date is the last value of the array timestamps 
                // and that this date is in the same month as the previous value.
                else if (datePostition === timestamps?.length-1) {
                    times.push(currTime);
                    sumMoodOftheMonth += moods[datePostition];
                    nbOfValuesOfTheMonth += 1;
                    monthlyAverageMood.push(sumMoodOftheMonth / nbOfValuesOfTheMonth);
                    datePostition+=1;
                    setAvgMoods(monthlyAverageMood);
                    const mothsGraph = times?.map(time => moment(time).format('MMMM'));
                    setMonths(mothsGraph);
                }
                // case where the date is in the same month as the previous value.
                else if(moment(timestamps?.slice(datePostition)[0]).isSame(currTime, 'month')) {
                    sumMoodOftheMonth += moods[datePostition];
                    nbOfValuesOfTheMonth += 1;
                    datePostition +=1; 
                // case where the date is not in the same month as the previous value.
                } else {
                    times.push(currTime);
                    currTime = timestamps?.slice(datePostition)[0];
                    monthlyAverageMood.push(sumMoodOftheMonth / nbOfValuesOfTheMonth);
                    nbOfValuesOfTheMonth = 0;
                    sumMoodOftheMonth = 0;
                }
            }
    }, [moodsObservations]);

    return (<Bar 
        className="graph"
        data={{
            labels: months,
            datasets: [
              {
                label: 'Mood percentage',
                backgroundColor: '#52a5ff',
                borderColor: '#0459b4',
                borderWidth: 2,
                maxBarThickness: 30,
                data: avgMoods
              }
            ]
          }}
        options={{
            plugins: {
                title: {
                  display: true,
                  text: "Monthly mood evolution"
                },
                legend: {
                  display: true,
                  position: "bottom"
               }
              },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    suggestedMax: 100
                },
            }
        }}/>)
}

const MoodGraph = () => {
    const [showMonthlyVue, setShowMonthlyVue] = useState<boolean>(true)
    // the function that alouds to switch from the monthly view of the graph 
    // to the detailed view of the last month where a mood was recorded.
    function changeVue() {
        setShowMonthlyVue(!showMonthlyVue)
    }

    return (
        <>
        <button className="switch-button"
                onClick={changeVue}>
            {showMonthlyVue? "Show last month's moods" : 'Show the monthly mood'}</button>
        {showMonthlyVue? <MonthlyMood/> : <LastMonthMood/>}
        </>
    )
  };
  
  export default MoodGraph;