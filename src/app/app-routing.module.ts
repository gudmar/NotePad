import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar/calendar.component';

const routes: Routes = [
  {path: 'calendar', component: CalendarComponent},
  // {path: 'notePad' , component: }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
