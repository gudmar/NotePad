import { Component } from '@angular/core';
import { UniqueIdProviderService} from './services/unique-id-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UniqueIdProviderService]
})
export class AppComponent {
  title = 'NotePad';
}
