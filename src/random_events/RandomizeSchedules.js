import React from 'react';
import Moment from 'moment';
import DataSource from '../datasource/datasource.json';

export default function RandomizeSchedules(){
    //Random day seven days from now
      function getRandomDay(){
        let currentDate=Moment();
        let rand=Math.floor(Math.random() * (8 - 1))+1;
        return (Moment(currentDate).add(rand,'days').toISOString());
      };
    
      function getRandomTime(day){
        let currentDay = Moment(day).utcOffset(0);
        if(currentDay.day()===0){
          return getRandomTime(getRandomDay());
        }
        let randOdd = Math.floor(Math.random() * (19 - 13))+13;
        let randEven = Math.floor(Math.random() * (14 - 8))+8;
        let randomBooleanHalf = Math.random() >= 0.5;
        let randHalfHour=0;
        if(randomBooleanHalf){
            randHalfHour=30;
        }

        let isOddDay = (currentDay.date()%2 !== 0);
        if(isOddDay){
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
        /*
        endTime.setHours(randNumber*endTime.getHours());
        startTime.setHours(randNumber*startTime.getHours());
        let x= endTime.toISOString;
        let y= startTime.toISOString;
        console.log(x,y);
        */
        return([String(endTime.toISOString()),String(dayRandTime)])
      };



    const newData = DataSource.scheduleData.map(item => {
        let randDatesArray = randomizeDates();
    //    console.log(randDatesArray[0],"kraj i pocetak",item.Subject ,randDatesArray[1]);
        return{...item, value: [item.EndTime=randDatesArray[0], item.StartTime=randDatesArray[1]] };
        //return{...item, value: [item.EndTime=String(new Date().toISOString()), item.StartTime=String(new Date("2020-06-06T04:00:00.000Z"))] };
    });
    return newData;
}
