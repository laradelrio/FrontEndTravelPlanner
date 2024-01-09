import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { finalize } from 'rxjs';
import { Sight } from '@app/core/interfaces/sight.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  @Input() set setSights(value: Sight[]) {
    this.sights = value;
    if (this.sights.length != 0) {
      this.formatSightsForCalendar()
    }
  };
  private sights!: Sight[];
  sightsArray: {}[] = [];


  eventsPromise!: Promise<any>;


  ngOnInit(): void {
    this.updateCalendar()
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
    // eventClick: ((arg) => this.handleEventClick(arg))
  }

  // handleEventClick(arg: EventClickArg){
  //   let eventClicked : Event;
  //   this.eventService.getEventsById(arg.event.id)
  //   .pipe(
  //     finalize( () => {
  //       this.eventService.event = eventClicked;
  //       this.router.navigate(['/event'])
  //     })
  //   )
  //   .subscribe(
  //     (res) => eventClicked = res.data[0]
  //   )
  // }

  // getEvents(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.eventService.getAllEvents()
  //       .pipe(
  //         finalize(() => resolve(this.eventsArray))
  //       )
  //       .subscribe((res) => {
  //         res.data.forEach((event) => {
  //           let date = (event.date).toString().slice(0, 10);
  //           this.eventsArray.push(
  //             {
  //               id: `${event.id_event}`,
  //               start: `${date}T${event.time}`,
  //               title: `${event.name}`,
  //               editable: false,
  //             })
  //         }
  //         )
  //       })
  //   })
  // }

  //adds the events to the calendar
  async updateCalendar() {
    let events: EventInput[] = this.sightsArray;
    this.calendarOptions!.events = { events, backgroundColor: '#5cebda', borderColor: '#5cebda' };
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

}
