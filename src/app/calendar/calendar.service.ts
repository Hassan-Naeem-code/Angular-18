import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Appointment {
  id: number;
  title: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private appointmentBehaviorSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentBehaviorSubject.asObservable();

  private appointments: Appointment[] = [];

  constructor() {}

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    this.appointmentBehaviorSubject.next(this.appointments);
  }

  deleteAppointment(id: number): void {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== id
    );
    this.appointmentBehaviorSubject.next(this.appointments);
  }

  updateAppointment(id: number, newDate: Date): void {
    const appointment = this.appointments.find((app) => app.id === id);
    if (appointment) {
      appointment.date = newDate;
      this.appointmentBehaviorSubject.next(this.appointments);
    }
  }
}
