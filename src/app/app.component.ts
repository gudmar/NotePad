import { Component } from '@angular/core';
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
}
