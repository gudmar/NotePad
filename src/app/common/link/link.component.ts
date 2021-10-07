import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  @Input() link: string = '';
  @Input() linkName: string = '';
  isEditable = true;
  constructor() { }

  ngOnInit(): void {
  }
  @ViewChild('a') a:any;

  @HostListener('keydown', ['$event'])
  activateEditable(event: any){
    console.log(event.ctrlKey);
    if (event.ctrlKey){
      this.isEditable = true;
    }
    console.log('isEditable' + this.isEditable)
  }
  @HostListener('keyUp', ['$event'])
  disactivateEditable(event: any){
    console.log(event.ctrlKey);
    if (!event.ctrlKey){
      this.isEditable = true;
    }
    console.log('isEditable' + this.isEditable)
  }

  @HostListener('click', ['$event'])
  goToLink(event:any){
    if (!this.isEditable){
      
    }
  }
}
