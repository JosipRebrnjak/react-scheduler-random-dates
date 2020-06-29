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
//import { AnyRecord } from 'dns';
//import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';


class App extends React.Component{
  componentDidMount(){

  }
  private oddDatesWorkHours = WorkDates()[0];
  private evenDatesWorkHours = WorkDates()[1];
  private workingSaturdaysHours = WorkDates()[2];
  private islayoutChanged=false;
  public scheduleObj: ScheduleComponent = new ScheduleComponent({});
  private scheduleData = RandomizeSchedules();
  
  
  
  //schedule.appendTo("#root");
  //private schData: Object[] = DataSource.scheduleData;
  
  private dayEventTemplate(props: { [key: string]: Object }): JSX.Element{
   return(<div className='day-template-wrap' style={{background: 'green'}} >{props.Subject}</div>);
  };

  private monthEventTemplate(props: { [key: string]: Object }): JSX.Element{
    return(<div className='month-template-wrap' style={{ background: String(props.CategoryColor) }} >
      <div className='subject' style={{ background: String(props.CategoryColor)}} >{props.Subject}</div>
      <div className='location'>{props.Location}</div></div>);
  };
  
  onDataBound(props: any){ 
    if (this.islayoutChanged) {
    this.scheduleObj.resetWorkHours();
    for (var i = 0; i < this.oddDatesWorkHours.length; i++) {
          this.scheduleObj.setWorkHours([this.oddDatesWorkHours[i]], "13:00", "19:00");
        }
    for (var i = 0; i < this.evenDatesWorkHours.length; i++) {
          this.scheduleObj.setWorkHours([this.evenDatesWorkHours[i]], "08:00", "14:00"); 
        }
    for (var i = 0; i < this.workingSaturdaysHours.length; i++) {
          this.scheduleObj.setWorkHours([this.workingSaturdaysHours[i]], "08:00", "14:00"); 
    }
    console.log(this.scheduleObj);
  }
  }
 
  onActionComplete(props: any) {
    if (props.requestType === "toolBarItemRendered" || props.requestType === "dateNavigate" || props.requestType === "viewNavigate") {
        this.islayoutChanged = true;
    }
  }

  onActionBegin(props: any){
    console.log("Nešto se događa");
    if (props.requestType === 'onCel' && props.data.length > 0) {
      let eventData = props.data[0];
   //  this.scheduleObj.workCellAction;
      console.log("Uvjet je prošao");
      console.log(eventData);
     // let startDate = eventData[eventField.startTime];
     // let endDate = eventData[eventField.endTime];
     console.log(this.workingSaturdaysHours[2], this.workingSaturdaysHours[3]);
     // props.cancel = !this.scheduleObj.isSlotAvailable();
      
    }
  }
  onPopupOpen(props:any) {
    //props.cancel = true;
  }

  editorTemplate(props: any) {
    return (props !== undefined ? <table className="custom-event-editor" style={{ width: '100%', padding: '5' }}><tbody>
  <tr><td className="e-textlabel">Full Name</td><td colSpan={4}>
    <input id="FullName" className="e-field e-input" type="text" name="FullName" style={{ width: '100%' }}/>
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
  if (props.type !== "workCells") {
          let ele = createElement('div', {
              className: 'templatewrap'
          });
          (props.element).appendChild(ele);
  }
  /*
  if (props.type !== "workCells") {
    return (<div className="templatewrap" aria-readonly="true" style={{backgroundColor:'red'}}></div>);
}*/
}

cellTemplate(props: any){
  if (props.type !== "workCells") {
    return (<div className="templatewrap" aria-readonly="true" style={{backgroundColor:'red'}}></div>);
}
}


  public render(){
    return (
    <div className="schedule-control">
      <ScheduleComponent id="schedule" firstDayOfWeek={1}  actionBegin={this.onActionBegin.bind(this)} 
            minDate={new Date()} timezone='UTC' readOnly={true} 
            ref={(schedule: ScheduleComponent) => this.scheduleObj = schedule} 
            dataBound={this.onDataBound.bind(this)} 
            startHour="05:00" endHour="22:00"  
            showQuickInfo={false}
            workHours={{ highlight: true }} 
            eventSettings={{ dataSource: this.scheduleData , allowEditing:false, allowDeleting:false }}
            popupOpen={this.onPopupOpen.bind(this)}
            editorTemplate={this.editorTemplate.bind(this)}
            actionComplete={this.onActionComplete.bind(this)}
            renderCell={this.onRenderCell.bind(this)}
            cellTemplate={this.cellTemplate.bind(this)}
             >
        <ViewsDirective>
                <ViewDirective option='Day' />
                <ViewDirective option='Week' />
                <ViewDirective option='Month' />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
    )
  }
}
export default App;

