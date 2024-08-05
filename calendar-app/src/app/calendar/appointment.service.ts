import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Appointment {
  date: Date;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  addAppointment(appointment: Appointment) {
    const currentAppointments = this.appointmentsSubject.getValue();
    this.appointmentsSubject.next([...currentAppointments, appointment]);
  }

  removeAppointment(appointment: Appointment) {
    const currentAppointments = this.appointmentsSubject.getValue();
    this.appointmentsSubject.next(currentAppointments.filter(a => a !== appointment));
  }
}
