import { Component } from '@angular/core';
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
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  appointments$: Observable<Appointment[]>;
  appointmentForm: FormGroup;
  calendar: any[] = [
    { dayName: 'Sunday', index: 0 },
    { dayName: 'Monday', index: 1 },
    { dayName: 'Tuesday', index: 2 },
    { dayName: 'Wednesday', index: 3 },
    { dayName: 'Thursday', index: 4 },
    { dayName: 'Friday', index: 5 },
    { dayName: 'Saturday', index: 6 },
  ];

  constructor(
    private snackBar: MatSnackBar,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder
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
