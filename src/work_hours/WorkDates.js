import React from 'react';
import Moment from 'moment';

function WorkDates () {
    let dateOddArray = [];
    let dateEvenArray = [];
    let workSaturdayArray = [];
    let currentDate = Moment();
    currentDate.set({hour:0,minute:0,second:0,millisecond:0})
    //Set work dates to end of year
    let stopDate = Moment().endOf('year');
    //Make arrays of working dates
    while (currentDate <= stopDate) {
        if(currentDate.date() % 2 !== 0 && currentDate.day() !== 6 && currentDate.day() !== 0){
            dateOddArray.push((Moment(currentDate)).toDate());
        }else if(currentDate.date() % 2 === 0 && currentDate.day() !== 6 && currentDate.day() !== 0){
            dateEvenArray.push((Moment(currentDate)).toDate());
        }else if(currentDate.date() % 2 === 0 && currentDate.day() === 6){
            workSaturdayArray.push((Moment(currentDate)).toDate());
        }
        currentDate = Moment(currentDate).add(1, 'days');
    }
    return ([dateOddArray, dateEvenArray, workSaturdayArray]);
}
export default WorkDates;

