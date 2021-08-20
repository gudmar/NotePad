import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'wb-button',
  templateUrl: './wb-button.component.html',
  styleUrls: ['./wb-button.component.css']
})
export class WbButtonComponent implements OnInit {
  @Input() uniqueId: string = '';
  @Input() pictogram: string = '';
  @Input() isPushed: boolean = false;
  @Output() wasClicked: EventEmitter<any> = new EventEmitter();
  dynamicClass: any = {
    pushed: false
  }
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('click')
  onClick(){
    this.wasClicked.emit()
  }

}
