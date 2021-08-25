import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SetColorsDirective } from '../../../../directives/set-colors.directive';
import { CommunicationService } from '../../../../services/communication.service'

@Component({
  selector: 'day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @Input() colorThemeHue: number = 240;
  constructor(private communicator: CommunicationService) { }
  @Input() dayDescriptor: {
    dayMonthIndex: number, 
    dayWeekIndex: number, 
    dayName: string, 
    month: number, 
    year: number,
    events?: any[]
  } = {dayMonthIndex: 0, dayWeekIndex: 0, dayName: '', month: 0, year: 0}

  get events() { 
    if (this.dayDescriptor.events == undefined) return []
    return this.dayDescriptor.events.length > 0? this.dayDescriptor.events : []
  }
  get monthDayIndex() {return this.dayDescriptor.dayMonthIndex;}

  @HostListener('click')
  onClick(){
    this.communicator.inform('openDayEditWindow', {})
  }

  ngOnInit(): void {
    
  }

  getBgColorDependOnEventsNumber(){
    if (this.events.length == 0) return  `hsl(${this.colorThemeHue}, 80%, 80%)`
    if (this.events.length <=  2) return `hsl(${this.colorThemeHue}, 80%, 70%)`
    if (this.events.length <=  4) return `hsl(${this.colorThemeHue}, 80%, 60%)`
    if (this.events.length <=  6) return `hsl(${this.colorThemeHue}, 80%, 50%)`
    if (this.events.length <=  8) return `hsl(${this.colorThemeHue}, 80%, 40%)`
    return `hsl(${this.colorThemeHue}, 80%, 30%}`
  }

}


    // [dBgColor]="getBgColorDependOnEventsNumber()" 
    //     <div *ngIf="events.length > 0" 
                        
    //         {{events.length>9?'9+':events.length}}
    // <div class="day-number">{{monthDayIndex}}</div>

