import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoteComponent } from './note/note.component';
import { MovablePointComponent } from './movable-point/movable-point.component';
import { MovableDirective } from './directives/movable.directive';
import { MovableParentDirective } from './directives/movable-parent.directive';
import { ResizeParentDirective } from './directives/resize-parent.directive';
import { SheetComponent } from './sheet/sheet/sheet.component';
import { TabComponent } from './sheet/tab/tab.component';
import { TabMenuComponent } from './sheet/tab-menu/tab-menu.component';
import { UniqueIdProviderService} from './services/unique-id-provider.service';
import { NextColorGeneratorService } from './services/next-color-generator.service';
import { FalseDataMockService } from './services/false-data-mock.service';
import { DescriptorToDataService } from './services/descriptor-to-data.service'
import { PageComponent } from './sheet/page/page.component';
import { WorkBookComponent } from './work-book/work-book.component';
import { PageMenuComponent } from './sheet/page/page-menu/page-menu.component';
import { CommunicationService } from './services/communication.service';
import { WbMenuComponent } from './work-book/wb-menu/wb-menu.component';
import { WbMenuEntryComponent } from './work-book/wb-menu/wb-menu-entry/wb-menu-entry.component';
import { WbButtonComponent } from './work-book/wb-menu/wb-button/wb-button.component'
import { StorageManagerService } from './services/storage-manager.service';
import { SetColorsDirective } from './directives/set-colors.directive';
import { KillMeComponent } from './common/kill-me/kill-me.component';
import { ConfirmationWindowComponent } from './common/confirmation-window/confirmation-window.component';
import { SaveLoadWindowComponent } from './common/save-load-window/save-load-window.component';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { WeekViewComponent } from './calendar/week-view/week-view.component';
import { MonthViewComponent } from './calendar/month-view/month-view.component';
import { MonthComponent } from './calendar/month-view/month/month.component';
import { DayComponent } from './calendar/month-view/month/day/day.component';
import { MobileViewComponent } from './calendar/mobile-view/mobile-view.component';
import { WaitingSpinnerComponent } from './common/waiting-spinner/waiting-spinner.component';
import { TaskViewerComponent } from './calendar/task-viewer/task-viewer.component';
import { MoveToWindowComponent } from './calendar/task-viewer/move-to-window/move-to-window.component';


@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    MovablePointComponent,
    MovableDirective,
    MovableParentDirective,
    ResizeParentDirective,
    SetColorsDirective,
    SheetComponent,
    TabComponent,
    TabMenuComponent,
    PageComponent,
    WorkBookComponent,
    PageMenuComponent,
    WbMenuComponent,
    WbMenuEntryComponent,
    WbButtonComponent,
    KillMeComponent,
    ConfirmationWindowComponent,
    SaveLoadWindowComponent,
    CalendarComponent,
    WeekViewComponent,
    MonthViewComponent,
    MonthComponent,
    DayComponent,
    MobileViewComponent,
    WaitingSpinnerComponent,
    TaskViewerComponent,
    MoveToWindowComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
              UniqueIdProviderService,
              NextColorGeneratorService,
              FalseDataMockService,
              CommunicationService,
              DescriptorToDataService,
              StorageManagerService,
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
