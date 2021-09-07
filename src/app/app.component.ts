import { Component, HostListener, Host } from '@angular/core';
import { UniqueIdProviderService} from './services/unique-id-provider.service';
import { CommunicationService } from './services/communication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UniqueIdProviderService, CommunicationService]
})
export class AppComponent {
  title = 'NotePad';
  shouldDisplayWaitingSpinner = true;
  constructor(private messenger:CommunicationService){}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent){
    if ((event.metaKey || event.ctrlKey) && event.key === 's'){
      event.preventDefault();
      this.messenger.inform('saveToLastUsedKey', '')
    }

  }
}
