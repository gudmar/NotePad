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
import { ContentManagerService } from './services/content-manager.service';
import { DescriptorToDataService } from './services/descriptor-to-data.service'
import { PageComponent } from './sheet/page/page.component';
import { WorkBookComponent } from './work-book/work-book.component';
import { PageMenuComponent } from './sheet/page/page-menu/page-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    MovablePointComponent,
    MovableDirective,
    MovableParentDirective,
    ResizeParentDirective,
    SheetComponent,
    TabComponent,
    TabMenuComponent,
    PageComponent,
    WorkBookComponent,
    PageMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
              UniqueIdProviderService,
              NextColorGeneratorService,
              ContentManagerService,
              DescriptorToDataService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
