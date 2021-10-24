import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { NotePadComponent } from './note-pad/note-pad.component';
import { LinkSearcherComponent } from './common/link-searcher/link-searcher.component';



const routes: Routes = [
  {path: 'calendar', component: CalendarComponent},
  {path: 'notePad' , component: NotePadComponent},
  {path: 'linker' , component: LinkSearcherComponent},
  {path: '**' , component: NotePadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
