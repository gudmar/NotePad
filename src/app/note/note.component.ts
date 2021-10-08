import { 
  Component, 
  OnInit, 
  EventEmitter, 
  Output, 
  Input, 
  Host, 
  ViewChild, 
  ElementRef, 
  HostListener 
} from '@angular/core';

import { CommunicationService } from '../services/communication.service'
import { NextColorGeneratorService } from '../services/next-color-generator.service'
import { connect } from 'http2';
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  // providers: [CommunicationService]
})
export class NoteComponent implements OnInit {
  private _isActive: boolean = false;
  @Input() initialWidth: number = 100;
  // @Input() initialHeight: number = 100;
  _initialHeight = 100;
  @Input() set initialHeight(val: number){
    this._initialHeight  = val;
    this.resizeNote();
    console.log(val)
  }
  noteToggler = true;
  resizeNote() {
    setTimeout(()=>{
      let mem = this.noteToggler;
      this.noteToggler = !mem;
      return !mem;
    })
  }
  get initialHeight() {return this._initialHeight}
  private _isEditable: boolean = true;
  @Input() set isEditable(val:boolean){
    let t = setTimeout(()=>{this._isEditable = val; clearTimeout(t)})
  }
  get isEditable() {return this._isEditable}
  @Input() initialTop: number = 30;
  @Input() initialLeft: number = 30;
  @Input() content: string = '';
  @Input() uniqueId: string = '';
  @Input() bgColor: string = '';
  @Input() set isActive (val: boolean) {
    this._isActive = val;
    this.noteAcitiveChanged.emit({uniqueId: this.uniqueId, data: val})
    if (val == true){
      if (this.colorManager.getFgColor(this.bgColor) === 'white') {
        this.dynamicClass['active-bgDark'] = true;
        this.dynamicClass['active-bgLight'] = false;
      }
      if (this.colorManager.getFgColor(this.bgColor) === 'black') {
        this.dynamicClass['active-bgDark'] = false;
        this.dynamicClass['active-bgLight'] = true;
      }
      this.elRef.nativeElement.querySelector('.content-holder').focus();
    } else {
      this.dynamicClass['active-bgDark'] = false;
      this.dynamicClass['active-bgLight'] = false;    
    }
  }
  get isActive() {return this._isActive}
  @Output() noteWasMoved: EventEmitter<any> = new EventEmitter();
  @Output() noteWasResized: EventEmitter<any> = new EventEmitter();
  @Output() noteContentChanged: EventEmitter<any> = new EventEmitter();
  @Output() noteAcitiveChanged: EventEmitter<any> = new EventEmitter();
  private _wasActivated: boolean = false;
  @ViewChild('contentHolder') contentHolder: any;

  @HostListener('click', ['$event'])
  thisNoteWasClicked($event: any){
    this.messenger.inform('noteWasClicked', this.uniqueId)
    $event.stopPropagation();
    console.dir($event.target)
    let targetClassList = $event.target.classList;
    if (targetClassList.contains('copyable')){
      console.log('Hurrraaaa');
      (navigator as any).clipboard.writeText($event.target.innerText);
      this.messenger.inform('displayMessageAndDoNotDisturb', {message:'Copied to clipboard'})
    }


    // onclick="function(e){navigator.clipboard.writeText(e.target.innerText)}
  }



  dynamicClass: any = {
    'active-bgDark': false,
    'active-bgLight': false
  }

  constructor(
    private messenger: CommunicationService, 
    private colorManager: NextColorGeneratorService,
    private elRef: ElementRef
  ) { 
    this.messenger.subscribe(this.uniqueId, 
      this.handleMessages.bind(this), 
      ['noteWasClicked', 'pageWasClicked', 'eachNoteShouldShow', 'ifThereIsAnyActiveNotePleaseTransmitData']
    )
  }

  informAboutMovement(data: any){
    this.noteWasMoved.emit(data)
    this.messenger.inform('noteWasMoved', {
      objectId: this.uniqueId,
      pageX: data.pageX,
      pageY: data.pageY
    })
  }

  killMe(event: any){
    event.stopPropagation();
    this.messenger.inform('killMe', this.uniqueId)
  }

  informAboutResize(data: any){
    this.noteWasResized.emit(data);
    this.messenger.inform('noteWasResized', {
      objectId: this.uniqueId,
      newWidth: data.width,
      newHeight: data.height
    })
  }

  @HostListener('keyup', ['$event'])
  changeNoteHeight(event:any){
    if (event.keyCode != 17){
      let newHeight = this.recalculatedNoteSize();
      console.log(`newH: ${newHeight}, initialH: ${this.initialHeight}`)
      if (newHeight > this.initialHeight) {
        this.messenger.inform('noteContentChanged', {
          objectId: this.uniqueId,
          newHeight: newHeight
        })
      }  
    }
    // if (event.keyCode == 17){
    //   let t = setTimeout(()=>{this.isEditable = true; clearTimeout(t)});
    //   console.log('isEditable' + this.isEditable)
    // }
    console.log(event)
  }

  @HostListener('keydown.control.d', ['$event'])
  deleteHighlitedText(event:any){
    event.stopPropagation();
    event.preventDefault();
    console.dir(event)
    this.replaceSelectedText('');
  }
  @HostListener('keydown.control.m', ['$event'])
  addCopyContentElement(event:any){
    this.replaceSelectedWithCopyTextElement();
  }

  @HostListener('keydown', ['$event'])
  replaceWithLink(event:any){
    if (event.ctrlKey && event.key == 'l'){
      event.stopPropagation();
      event.preventDefault();
      let content = this.getSelectedText();
      console.log(event)
      if (content != ''){
        // document.execCommand('createLink', true, `${content}`)
        // `)
        let linkElement = this.createLinkElement(<string>content, <string>content);
        this.replaceSelectedTextWithElement(linkElement);
      }
      let noteContent = this.contentHolder.nativeElement.innerHTML;
      console.log(noteContent)
      this.content = noteContent;
    }
  }

  // @HostListener('keydown', ['$event'])
  // // NIE MOŻE BYĆ, bo ctrl + b nie zadziala
  // activateEditable(event: any){
  //   console.log(event.ctrlKey);
  //   if (event.ctrlKey){
  //     let t = setTimeout(()=>{this.isEditable = false; });
  //     // this.isEditable = false;
  //   }
  //   console.log('isEditable' + this.isEditable)
  // }


  // @HostListener('keyup', ['$event'])
  // disactivateEditable(event: any){
  //   console.log(event.ctrlKey);
  //   if (event.ctrlKey){
  //     // let t = setTimeout(()=>{this.isEditable = true; clearTimeout(t)});
  //   }
  //   console.log('isEditable' + this.isEditable)
  // }

  getSelectedText(){
    if (window.getSelection){
      return window.getSelection();
    }
    return '';
  }

  replaceSelectedWithCopyTextElement(){
    let sel = window.getSelection();
    if (sel != null){
      console.log(sel);
      let copyableElement = this.htmlToElement(this.getCopyTextElement(sel.toString()));
      console.log(copyableElement)
      let copyableElement1 = sel.getRangeAt(0).createContextualFragment(this.getCopyTextElement(sel.toString()))
      this.replaceSelectedTextWithElement(<HTMLElement>copyableElement)
    } else {
      console.warn('No text selected, cannot add copyable element')
    }
  }

  getCopyTextElement(textToCopy:string){
    return `
      <div class="copyable">${textToCopy}</div>
    `
  }

  htmlToElement(htmlString: string){
    let template = document.createElement('template');
    htmlString = htmlString.trim();
    template.innerHTML = htmlString;
    return template.content.firstChild;
  }

  replaceSelectedText(replacementText:string){
    let sel, range;
    if (window.getSelection){
      sel = window.getSelection();
      if (sel!.rangeCount) {
        range = sel!.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacementText));
      }
    }
    // } else if (document.selection && document.createRange ) {
    //   range = document.selection.createRange();
    //   range.text = replacementText;
    // }
  }
  createLinkElement(linkName:string, link:string){
    // let element = document.createElement('button');
    // element.onclick=function(){window.open(link, "_blank")}
    // element.innerText=linkName;
    // debugger;
    let element = document.createElement('a');
    element.href = link.toString().startsWith('http')?link:'//'+link;
    element.setAttribute('contentEditable','true');
    element.innerText = linkName;
    element.target='_blank'
    return element;
  }
  replaceSelectedTextWithElement(replacementElement:HTMLElement){
    let sel, range;
    if (window.getSelection){
      sel = window.getSelection();
      if (sel!.rangeCount) {
        range = sel!.getRangeAt(0);
        range.deleteContents();
        range.insertNode(replacementElement);
      }
    }
  }

  informAboutContentChange(data: any){
    this.noteContentChanged.emit(data);
    this.messenger.inform('noteContentChanged', {
      objectId: this.uniqueId,
      content: this.contentHolder.nativeElement.innerHTML
    })
  }

  handleMessages(messageType: string, data:any){
    if (messageType == 'noteWasClicked'){
      if (data == this.uniqueId){
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
    if (messageType == 'pageWasClicked'){
      
      this.isActive = false;
    }
    if (messageType == 'eachNoteShouldShow'){
      this.isActive = true;
    }
    if (messageType == 'getActiveNoteContent'){
      if(this.isActive) this.messenger.inform('activeNoteDataIs', 
        {
          uniqueId: this.uniqueId,
          content: this.elRef.nativeElement.innerHTML
        }
      )
    }
    if(messageType == 'ifThereIsAnyActiveNotePleaseTransmitData'){
      if (this.isActive) {
        this.messenger.inform('activeNoteResponse',{
          uniqueId: this.uniqueId, content: this.elRef.nativeElement.querySelector('.content-holder').innerHTML
        })
      }
    }
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.messenger.unsubscribe(this.uniqueId)
  }


  recalculatedNoteSize(){
    let actualHeight = parseInt(this.contentHolder.nativeElement.offsetHeight);
    return actualHeight > this.initialHeight ? actualHeight : this.initialHeight;
  }

}
