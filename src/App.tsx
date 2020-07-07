import React, { Props } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Inject, Schedule, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective} from '@syncfusion/ej2-react-schedule';
import RandomizeSchedules from './random_events/RandomizeSchedules';
import DataSource from './datasource/datasource.json';
import {extend, createElement} from '@syncfusion/ej2-base';
import WorkDates from './work_hours/WorkDates.js'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import CheckState from './work_hours/CheckAppointmentsState';
//import { AnyRecord } from 'dns';
//import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';


class App extends React.Component{
  componentDidMount(){
    console.log(this);
  }
  private oddDatesWorkHours = WorkDates()[0];
  private evenDatesWorkHours = WorkDates()[1];
  private workingSaturdaysHours = WorkDates()[2];
  private islayoutChanged=false;
  private scheduleObj: ScheduleComponent = new ScheduleComponent({});
  private scheduleData = RandomizeSchedules();
  private createdAppointments: Object[]=[];
  
  
  private dayEventTemplate(props: { [key: string]: Object }): JSX.Element{
   return(<div className='day-template-wrap' style={{background:  String(props.CategoryColor)}} >{props.Subject}</div>);
  };

  private defaultEventTemplate(props: { [key: string]: Object }): JSX.Element{
    return(<div className='default-template-wrap' style={{ background: String(props.CategoryColor), height:"100%", color:"black"  }} >
      <div className='subject' style={{ background: String(props.CategoryColor)}} >{props.Subject}</div>
      <div className='location'>{props.Location}</div></div>);
  };
  


  onDataBound(props: any){ 
    if (this.islayoutChanged) {
    this.scheduleObj.resetWorkHours();
    //Setting work hours
    for (let i = 0; i < this.oddDatesWorkHours.length; i++) {
          this.scheduleObj.setWorkHours([this.oddDatesWorkHours[i]], "13:00", "19:00");
        }
    for (let i = 0; i < this.evenDatesWorkHours.length; i++) {
          this.scheduleObj.setWorkHours([this.evenDatesWorkHours[i]], "08:00", "14:00"); 
        }
    for (let i = 0; i < this.workingSaturdaysHours.length; i++) {
          this.scheduleObj.setWorkHours([this.workingSaturdaysHours[i]], "08:00", "14:00"); 
    }
 //console.log(this.scheduleObj);
  }
  }
 
  onActionComplete(props: any) {
    if (props.requestType === "toolBarItemRendered" || props.requestType === "dateNavigate" || props.requestType === "viewNavigate") {
        this.islayoutChanged = true;
    }
  }

  onActionBegin(props: any){
    if(props.requestType === 'eventCreate' && props.data.length > 0){
      let eventData = props.data[0];
          //  console.log(props.data[0].StartTime);
           // console.log(this.createdAppointments);
            let checkState = CheckState(this.createdAppointments, props.data[0].StartTime);
            if(checkState){
              this.createdAppointments.push(props.data[0].StartTime);
            }else{
              console.log(props.data[0].StartTime);
              props.cancel=true;
            }
            
            //let endDate = eventData[eventField.endTime];
          //  props.cancel = !this.scheduleObj.isSlotAvailable(startDate, endDate);
    }
    
    if (props.requestType === 'eventCreate' && !this.scheduleObj.isSlotAvailable(props.data[0].StartTime, props.data[0].EndTime)) {
      let eventData = props.data;
     // console.log("Nešto se događa", props);
      let startDate = eventData[0].StartTime;
      let endDate = eventData[0].EndTime;
      
    }
  }

  onPopupOpen(props:any) {
  //  console.log(props);
    //props.cancel = true;
  }

  editorTemplate(props: any) {
    return (props !== undefined ? <table className="custom-event-editor" style={{ width: '100%', padding: '5' }}><tbody>
  <tr><td className="e-textlabel">Full Name</td><td colSpan={4}>
    <input id="FullName" className="e-field e-input" type="text" name="Subject" style={{ width: '100%' }}/>
  </td></tr>
  <tr><td className="e-textlabel">Status</td><td colSpan={4}>
    <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType" className="e-field" style={{ width: '100%' }} dataSource={['First exam', 'Check Up', 'Other']} value={props.EventType || null}></DropDownListComponent>
  </td></tr>
  <tr><td className="e-textlabel">From</td><td colSpan={4}>
    <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.startTime || props.StartTime)} readOnly={true} className="e-field"></DateTimePickerComponent>
  </td></tr>
  <tr><td className="e-textlabel">To</td><td colSpan={4}>
    <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} readOnly={true} className="e-field"></DateTimePickerComponent>
  </td></tr>
  <tr><td className="e-textlabel">Description</td><td colSpan={4}>
    <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
  </td></tr></tbody></table> : <div></div>);
}

onRenderCell(props: any) {
  if( !props.element.classList.contains('e-work-hours')){
 //   props.element.classList.add('e-disable-range');
  //  props.cancel=true;
   //console.log(props);
  }
}

cellTemplate(props: any){
 // console.log(props.type);
/*
  if (props.type !== "workCells") {
    return (<div className="templatewrap" aria-readonly="true" style={{backgroundColor:'red'}}></div>);
}*/
}

onCellClick(props: any){
  if(!props.element.classList.contains('e-work-hours') || !this.scheduleObj.isSlotAvailable(props.startTime,props.endTime)){
    props.cancel=true;
  }
}



  public render(){
    return (
    <div className="schedule-control">
      <ScheduleComponent id="schedule" firstDayOfWeek={1} actionBegin={this.onActionBegin.bind(this)} 
            minDate={new Date(new Date())} timezone='UTC' readOnly={true} 
            ref={(schedule: ScheduleComponent) => this.scheduleObj = schedule} 
            dataBound={this.onDataBound.bind(this)} 
            startHour="05:00" endHour="22:00"  
            cellDoubleClick={this.onCellClick.bind(this)}
            workHours={{ highlight: true }} 
            eventSettings={{ dataSource: this.scheduleData , allowEditing:false, allowDeleting:false }}
            popupOpen={this.onPopupOpen.bind(this)}
            editorTemplate={this.editorTemplate.bind(this)}
            actionComplete={this.onActionComplete.bind(this)}
            renderCell={this.onRenderCell.bind(this)}
            cellTemplate={this.cellTemplate.bind(this)}
            cellClick={this.onCellClick.bind(this)}
             >
        <ViewsDirective>
                <ViewDirective eventTemplate={this.defaultEventTemplate.bind(this)} option='Day' />
                <ViewDirective eventTemplate={this.defaultEventTemplate.bind(this)} option='Week' />
                <ViewDirective eventTemplate={this.defaultEventTemplate.bind(this)} option='Month' />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
    )
  }
}
export default App;

