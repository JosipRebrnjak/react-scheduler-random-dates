import React from 'react';
import Moment from 'moment';
import DataSource from '../datasource/datasource.json';

export default function RandomizeSchedules(){
  let randArray = [];
  let newData= [];

    //Random day, possible seven day range 
      function getRandomDay(){
        let currentDate=Moment();
        let rand=Math.floor(Math.random() * (8 - 1))+1;
        return (Moment(currentDate).add(rand,'days').toISOString());
      };
    //Random time, work hours range
      function getRandomTime(day){
        let currentDay = Moment(day).utcOffset(0);
    //if day===0 (Sunday) randomize again
        if(currentDay.day()===0 || (currentDay.day()===6 && currentDay.date()%2 !== 0)){
          return getRandomTime(getRandomDay());
        }
        let randOdd = Math.floor(Math.random() * (19 - 13))+13;
        let randEven = Math.floor(Math.random() * (14 - 8))+8;
      //Random half hour
        let randomBooleanHalf = Math.random() >= 0.5;
        let randHalfHour=0;
        if(randomBooleanHalf){
            randHalfHour=30;
        }
        let isOddDay = (currentDay.date()%2 !== 0);
        if(isOddDay){
      //if break time set 30 min
            if(randOdd===16){
                randHalfHour=30;
            }
        currentDay.set({hour:randOdd,minute:randHalfHour,second:0,millisecond:0})
         //  console.log(currentDay.toISOString(), randOdd);
        return currentDay.toISOString();
        }else{
            if(randEven===11){
                randHalfHour=30;
            }
            currentDay.set({hour:randEven, minute:randHalfHour,second:0,millisecond:0})
         //   console.log(currentDay.toISOString(), randEven);
            return currentDay.toISOString();
        }
      }
      
      function randomizeDates(){
        
        let randDayNumber = getRandomDay();
        let dayRandTime = getRandomTime(randDayNumber);
        let endTime = Moment(dayRandTime).add(30,'minutes');
        let isRandomValid = alreadyExist(randArray, dayRandTime);
        if(isRandomValid){
          randArray.push(dayRandTime);
          return([String(endTime.toISOString()),String(dayRandTime)]);
        }else{
          randDayNumber = getRandomDay();
          dayRandTime = getRandomTime(randDayNumber);
          randArray.push(dayRandTime);
          endTime=Moment(dayRandTime).add(30,'minutes');
          return([String(endTime.toISOString()),String(dayRandTime)]);  
        }
      };

      function alreadyExist(array, dayRandTime){
        for(let i=0;i<array.length;i++){
//          console.log(array[i], dayRandTime);
          if(array[i]===dayRandTime){
            return false;
          }
        }
        return true;
      }
    
    /*
    let newData = DataSource.scheduleData.map(item => {
        let randDatesArray = randomizeDates();
        console.log(DataSource.scheduleData);
      //  console.log(randDatesArray[0], item.Subject, randDatesArray[1]);
        return{...item, value: [item.EndTime=randDatesArray[0], item.StartTime=randDatesArray[1]]};
    });
    */
    function addRandDates(newData){
      let schData = DataSource.scheduleData;
      for(let i=0;i<schData.length;i++){
        let randDatesArray = randomizeDates()
        schData[i].EndTime=randDatesArray[0];
        schData[i].StartTime=randDatesArray[1];
        newData.push(schData[i]);
    //    console.log(schData[i]);
      }
    }
    //add break times to events data array
    function addBreakTimes(newData){
      let currentDate=Moment().utcOffset(0);
      let stopDate = Moment().endOf('month');
      let diffDays = stopDate.diff(currentDate,'days');
      for(let i=0;i<=diffDays;i++){
        let breakTime = {
          "Id": null,
          "Subject": "Break time",
          "StartTime": null,
          "FullName":"Break",
          "EndTime": null,
          "CategoryColor": "#e34432"
        };
        if(currentDate.date() % 2 !== 0 && currentDate.day() !== 6 && currentDate.day() !== 0){
          let brTime = breakTime;
          brTime.Id=newData.length+1;
          let startTime =  currentDate.set({hour:16,minute:0,second:0,millisecond:0});
          let endTime = Moment(startTime).add(30,'minutes');
          brTime.StartTime=startTime.toISOString();
          brTime.EndTime=endTime.toISOString();
          brTime.value=[endTime.toISOString(), startTime.toISOString()]
          newData.push(brTime);
        }
        else if(currentDate.date() % 2 === 0 && currentDate.day() !== 6 && currentDate.day() !== 0){
          let brTime = breakTime;
          brTime.Id=newData.length+1;
          let startTime =  currentDate.set({hour:11,minute:0,second:0,millisecond:0});
          let endTime = Moment(startTime).add(30,'minutes');
          brTime.StartTime=startTime.toISOString();
          brTime.EndTime=endTime.toISOString();
          brTime.value=[endTime.toISOString(), startTime.toISOString()]
          newData.push(brTime);
        }else if(currentDate.date() % 2 === 0 && currentDate.day() === 6){
          let brTime = breakTime;
          brTime.Id=newData.length+1;
          let startTime =  currentDate.set({hour:11,minute:0,second:0,millisecond:0});
          let endTime = Moment(startTime).add(30,'minutes');
          brTime.StartTime=startTime.toISOString();
          brTime.EndTime=endTime.toISOString();
          brTime.value=[endTime.toISOString(), startTime.toISOString()]
          newData.push(brTime);
        }
      currentDate = Moment(currentDate).add(1, 'days');
      };
    return newData;
    
    }
    addRandDates(newData);
    addBreakTimes(newData);
    return newData;
}
