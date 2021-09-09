import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpContentService {

  constructor() { }

  getHelpContent(){
    return [
      {
        title: 'Notepad',
        content:'Application that can be used to note some data on pages inside sheets'
      },
      {
        title: 'Calendar',
        content: `Aplication for managing tasks. They can be added, deleted, displayed, moved to another dates,
          viewed in day, week or year view. Calendar is limited to display any year from 1000 to 3000.`
      },
      {
        title: 'Colors',
        content: `Colors of sheets or pages are calculated dynamicly, they repete after some period, because they cannot
        be to live, must be readable. So far they cannot be altered`
      },
      {
        title: 'Sheet',
        content: `Component containing pages, can be switched in notepad app with menu on the left. Sheets can be
        added with button at the bottom of sheet menu, and deleted with cross on the right of sheet name`
      },
      {
        title: 'Page',
        content: `Component containing movable and resizable note components. Here one may add notes`
      },
      {
        title: 'Note',
        content: `Movable and resizable component used to store notes. After being clicked it enters editable mode
        and can be altered or resized or moved. After clicking any space execpt for note when note is in editable mode
        it loses focus. Notes are added in edit mode. This mode can be selected in Options menu`
      }

    ]
  }

}
