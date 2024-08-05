import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AppointmentService, Appointment } from '../appointment.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  days: { date: Date, appointments: Appointment[] }[] = [];
  private appointmentSubscription: Subscription | null = null;

  @ViewChild('deleteArea') deleteArea!: ElementRef;


  constructor(private appointmentService: AppointmentService) { }

  ngOnInit() {
    this.initializeCalendar();
    this.appointmentSubscription = this.appointmentService.appointments$.subscribe(appointments => {
      this.updateAppointments(appointments);
    });
  }

  ngOnDestroy() {
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
  }

  initializeCalendar() {
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      this.days.push({ date: new Date(startDate.setDate(startDate.getDate() + 1)), appointments: [] });
    }
  }

  updateAppointments(appointments: Appointment[]) {
    this.days.forEach(day => {
      day.appointments = appointments.filter(appointment =>
        new Date(appointment.date).toDateString() === day.date.toDateString()
      );
    });
  }

  addAppointment(appointment: Appointment) {
    this.appointmentService.addAppointment(appointment);
  }

  // drop(event: CdkDragDrop<Appointment[]>) {
  //   console.log("event:", event.container.element.nativeElement);
  //   const isDeleteArea = event.container.element.nativeElement.id === 'delete-area';
  //   const prevData = event.previousContainer.data;
  //   const currData = event.container.data;

  //   if (isDeleteArea) {
  //     console.log("Dropping in delete area");
  //     const appointment = prevData[event.previousIndex];
  //     this.removeAppointment(appointment);
  //     prevData.splice(event.previousIndex, 1);
  //   } else if (event.previousContainer === event.container) {
  //     if (currData && prevData) {
  //       moveItemInArray(currData, event.previousIndex, event.currentIndex);
  //     }
  //   } else {
  //     if (currData && prevData) {
  //       transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
  //     }
  //   }
  // }

  drop(event: CdkDragDrop<Appointment[]>) {
    // console.log("Event:", event);

    const isDeleteArea = this.deleteArea.nativeElement === event.container.element.nativeElement;
    const prevData = event.previousContainer.data as Appointment[];
    const currData = event.container.data as Appointment[];

    if (isDeleteArea) {
      console.log("Dropping in delete area");
      const appointment = prevData[event.previousIndex];
      this.removeAppointment(appointment);
      // Remove the appointment from the previous container
      prevData.splice(event.previousIndex, 1);
    } else if (event.previousContainer === event.container) {
      // Move item within the same container
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
    } else {
      // Transfer item between containers
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
    }
  }


  deleteAppointment(day: { date: Date, appointments: Appointment[] }, appointment: Appointment) {
    this.removeAppointment(appointment);
    const index = day.appointments.indexOf(appointment);
    if (index > -1) {
      day.appointments.splice(index, 1);
    }
  }

  removeAppointment(appointment: Appointment) {
    console.log("Removing appointment:", appointment);
    this.appointmentService.removeAppointment(appointment);
  }
}
