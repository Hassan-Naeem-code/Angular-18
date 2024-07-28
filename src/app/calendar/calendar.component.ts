import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CalendarService, Appointment } from './calendar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from '../event-utils';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DragDropModule,
    FullCalendarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    droppable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    drop: this.handleDrop.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  // constructor(private changeDetector: ChangeDetectorRef) {}

  handleEventDrop(eventInfo: any) {
    console.log('Event dropped', eventInfo);
    // Handle event drop logic here
    this.changeDetector.detectChanges();
  }
  handleDrop(eventInfo: any) {
    console.log('Event dropped externally', eventInfo);
    // Handle external event drop logic here
    this.changeDetector.detectChanges();
  }
  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  appointments$: Observable<Appointment[]> | any;
  appointmentForm: FormGroup | any;
  calendar: any[] = [
    { dayName: 'Sunday', index: 1 },
    { dayName: 'Monday', index: 2 },
    { dayName: 'Tuesday', index: 3 },
    { dayName: 'Wednesday', index: 4 },
    { dayName: 'Thursday', index: 5 },
    { dayName: 'Friday', index: 6 },
    { dayName: 'Saturday', index: 7 },
  ];

  constructor(
    private snackBar: MatSnackBar,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.appointments$ = this.calendarService.appointments$;
    this.appointmentForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const newAppointment: Appointment = {
        id: Date.now(),
        title: this.appointmentForm.value.title,
        date: new Date(this.appointmentForm.value.date),
      };
      this.calendarService.addAppointment(newAppointment);
      this.appointmentForm.reset();
      this.snackBar.open('Appointment Added Successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  deleteAppointment(id: number): void {
    this.calendarService.deleteAppointment(id);
    this.snackBar.open('Appointment Deleted Successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  drop(event: CdkDragDrop<Appointment[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const draggedAppointment =
        event.previousContainer.data[event.previousIndex];
      const newDate = new Date(draggedAppointment.date);
      newDate.setDate(
        newDate.getDate() + (event.currentIndex - event.previousIndex)
      );
      this.calendarService.updateAppointment(draggedAppointment.id, newDate);
    }
  }
}
