import { Component, HostListener, Host } from '@angular/core';
import { UniqueIdProviderService} from './services/unique-id-provider.service';
import { CommunicationService } from './services/communication.service'
import { HelpContentService } from './services/help-content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UniqueIdProviderService, CommunicationService]
})
export class AppComponent {
  title = 'NotePad';
  shouldDisplayWaitingSpinner = true;
  helper = new HelpContentService();
  uniqueId = 'appId'
  constructor(
    private messenger:CommunicationService,
    helper: HelpContentService){
      this.messenger.subscribe(this.uniqueId, this.handleMessages.bind(this), ['showHideWaitingSpinner'])
    }
    handleMessages(eventType: string, data: any){
      if (eventType == 'showHideWaitingSpinner'){
        let on = ()=>{this.shouldDisplayWaitingSpinner = true;}
        let off = ()=>{this.shouldDisplayWaitingSpinner = false;}
      }
    }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent){
    if ((event.metaKey || event.ctrlKey) && event.key === 's'){
      event.preventDefault();
      this.messenger.inform('saveToLastUsedKey', '');
      this.messenger.inform('displayMessageAndDoNotDisturb', {message: 'Saved...'})
    }

  }

}
