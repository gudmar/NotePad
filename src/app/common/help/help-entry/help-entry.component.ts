import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'help-entry',
  templateUrl: './help-entry.component.html',
  styleUrls: ['./help-entry.component.css']
})
export class HelpEntryComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  isExpanded = false;
  constructor() { }

  ngOnInit(): void {
  }
  toggleExpand(){this.isExpanded = !this.isExpanded;}

  expand(){this.toggleExpand()}

}
