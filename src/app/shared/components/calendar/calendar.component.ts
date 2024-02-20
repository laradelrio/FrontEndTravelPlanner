import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Sight } from '@app/core/interfaces/sight.interface';
import { ModalComponent } from '../modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  @Input() set setSights(value: Sight[]) {
    this.sights = value;
    if (this.sights.length != 0) {
      this.formatSightsForCalendar()
    }
  };
  @Input() set tripStartDate(value: string) {
    if(value !== undefined){
      this.calendarOptions.initialDate =  value.slice(0,10)    }  
  };
  @ViewChild('sharedModal') modalComponent!: ModalComponent;
  private initialDate: string = '';
  private sights!: Sight[];
  sightsArray: {}[] = [];
  eventsPromise!: Promise<any>;
  modalInfo: ModalInfo = {
    style: '',
    title: '',
    body: '',
    btnClass: '.btn btn-blue',
    closeBtnName: '',
    actionBtnName: 'Okay'
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    eventClick: ((arg) => this.handleEventClick(arg))
  }

    handleEventClick(arg: EventClickArg){
    let eventClicked : Event;
    this.open();
  }


  //adds the events to the calendar
  async updateCalendar() {
    let events: EventInput[] = this.sightsArray;
    this.calendarOptions!.events = { events, backgroundColor: '#5cebda', borderColor: '#5cebda',} ;
  }

  formatSightsForCalendar() {
    this.sights.forEach((sight) => {
      this.sightsArray.push({
        id: `${sight.id}`,
        start: `${sight.startDate}`,
        end: `${sight.endDate}`,
        title: `${sight.name}`,
        editable: false,
      })
      this.updateCalendar()
    })
  }

  open() {
    this.openModal();
  }

  //Open Inactivity Modal
  async openModal() {
    return await this.modalComponent.open();
  }

}
