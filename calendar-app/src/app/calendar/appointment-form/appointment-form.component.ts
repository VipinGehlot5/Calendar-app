import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  @Output() newAppointment = new EventEmitter<Appointment>();
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.newAppointment.emit(this.appointmentForm.value);
      this.appointmentForm.reset();
    }
  }
}
