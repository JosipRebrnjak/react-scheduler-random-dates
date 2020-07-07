import React from 'react';
import Moment from 'moment';


function CheckState(state, checkDate) {
let twoInWeek=true;
for(let i=0;i<state.length;i++){
    let schDate = Moment(state[i]);
    let eventDate = Moment(checkDate)
    //Stop if same date or has two in same week
    if(schDate.dates()===eventDate.dates()||!twoInWeek){
        return false;
    }
    if(schDate.week()===eventDate.week()){
        twoInWeek=false;
    }
}
    return true;
}
export default CheckState;