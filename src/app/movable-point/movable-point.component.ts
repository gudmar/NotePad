import { HostListener, Component, OnInit, Host, ElementRef } from '@angular/core';

@Component({
  selector: 'movable-point',
  templateUrl: './movable-point.component.html',
  styleUrls: ['./movable-point.component.css']
})
export class MovablePointComponent implements OnInit {


  constructor(private elRef:ElementRef) { 

  }

  @HostListener('click', [])
  writeSomething(){
  }

  ngOnInit(){}

}
