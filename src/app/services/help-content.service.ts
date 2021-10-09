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
      },
      {
        title: 'Calendar year view',
        content: `View, where user sees whole year divided to months, calendar weeks and days. Each day having task
        has a label with number of tasks`
      },
      {
        title: 'Week view',
        content: `Calendar view, where user has apreview of whole week with summaries of tasks scheaduled for each day.
        By clicking a day user can get to day view to modify tasks`
      },
      {
        title: 'Day view',
        content: `Here user can add, remove, modify and move tasks to other days. Task details are visible here`
      },
      {
        title: 'Load window',
        content: `From here user may load document saved as key in browser local storage. Documents can be removed from
        here`
      },
      {
        title: 'Document',
        content: `JS object, or string representation of such object, with application state. Every note, page, sheet,
        task added by user, every description, every note movement and resizement are saved to document`
      },
      {
        title: 'Adding notes',
        content: `Options menu, chose <i>Edit mode</i>, click on page area, not occupated by other note object`
      },
      {
        title: 'Removing notes',
        content: `Click <i>X</i> button in right upper notes corner`
      },
      {
        title: 'Selecting notes',
        content: `Click area, where note is located to focus it`
      },

      {
        title: 'Moving notes',
        content: `Drag and move circle with four arrows in upper notes part`
      },
      {
        title: 'Adding pages',
        content: `Click <i>+</i> tab in upper part of application`
      },
      {
        title: 'Removing pages',
        content: `Click <i>X</i> symbol in right part of page tab. If there exist any notes on page 
        confirmation message box will be displayed`
      },
      {
        title: 'Selecting page',
        content: `Click on tab with page name in upper part of application`
      }, 
      {
        title: 'Renaming page',
        content: `Double click on page tab and print new name`
      },      
      {
        title: 'Adding sheet with a single page',
        content: `Double click on page tab and print new name`
      }, 
      {
        title: 'Adding sheet',
        content: `Click <i>Add +</i> tab in left side of application`
      }, 
      {
        title: 'Removing sheet',
        content: `Click <i>X</i> symbol in left part of sheet tab. If there exist some notes, 
        or there are more pages than single one, added by default, confiramtion box will be displayed to 
        ensure user did not click delete button by accident.`
      }, 
      {
        title: 'Renaming page',
        content: `Double click on page tab and print new name`
      }, 
      {
        title: 'Renaming sheet',
        content: `Double click sheet tab (left side of application)`
      }, 
      {
        title: 'Saving document content to local storage',
        content: `Menu (upper left corner), save, or <i>Ctrl+s</i>. Animation should aknowledge that data was saved.`
      }, 
      {
        title: 'Saving current document to a file',
        content: `Menu (upper left corner), save file. 
        Dialog window will be showed and default name of file will be proposed.`
      }, 
      {
        title: 'Saving current document to local strage',
        content: `Menu (upper left corner), save, or <i>Ctrl+s</i>. Animation should aknowledge that data was saved.`
      }, 
      {
        title: 'Uploading file as current document / load from file',
        content: `Valid file should be dragged and dropped onto page component area. Then file is loaded`
      },                         
      {
        title: 'File validation',
        content: `Files that are to be loaded by application are valideated. Not valid files cannot be uploaded.`
      },      
      {
        title: 'Loading from local storage',
        content: `Menu (upper left corner), Load button. Name of data key should be chosen by user, 
        and operation should be confirmed with <i>Load</i> button`
      },
      {
        title: 'Deleting a key from local storage',
        content: `From menu in upper left corner chose load option. 
        When menu is displayed chose key and click Remove. Then close load form.`
      },
      {
        title: 'Calendar - entering year view',
        content: `After launching calendar (upper left menu and calendar button), year view is displayed. 
        in upper bar year number can be changed. Year is calculated dynamicly. Years from 1000 to 3000 are available. 
        Buttons <i>>></i> and <i><<</i> are designed to switch to next and previous year.`
      },
      {
        title: 'Tesks in year view',
        content: `If there are any tasks added to day in year view, number of tasks will be displayed in red circle in right upper day corner. 
        Moreover the more tasks are planned for the day, darker the day background will be.`
      },
      {
        title: 'Calendar weeks',
        content: `Year view is displayed with calendar weeks and each month has days belonging to a calendar week, but not belonging to current month grayed.`
      },
      {
        title: 'Adding task to calendar',
        content: `Click day in clendar year view. If there are no tasks planned for that day, 
        click <i>+</i> symbol in the middle of day window. In case there are already tasks planned for the day, 
        click green <i>+</i> symbol in the right part of task. New task will be added before clicked one.`
      },
      {
        title: 'Removing task from calendar',
        content: `Click day in claendar year view. Click red <i>-</i> button in right part of task row. Task will be removed.`
      },                    
      {
        title: 'Moving task',
        content: `Click day in calendar year view. Click <i>move</i> label in right part of task row. 
        Widow will pop out and there new date might be chosen.`
      },                    
      {
        title: 'Date validation',
        content: `Year field in year view and date fields in move event to window are validated. 
        If not valid option is chosen, field background will change to red, and after field loses focus, 
        last valid value will be inserted into field.`
      },        
      {
        title: 'Summary field validation',
        content: `Click day in calendar year view. Click <i>move</i> label in right part of task row. 
        Widow will pop out and there new date might be chosen.`
      },          
      {
        title: 'Add link to notes',
        content: `Note component in notes supports links. In edit mode press Ctrl + l to create link out of highlited
        text. Link can be activated by click in not editable mode. Link description may be modified in editable mode,
        however link itself cannot. Pasted link will be clicable in not editable mode, but hold Ctrl while clicking on it,
        or else current tab will be redirected`
      },          
      {
        title: 'Adding copyable object, copy on click',
        content: `There can be added an onclick copy to clipboard object to notes component. Highlight a range in
        notes component and press Ctrl + m, and new click-copy-to-clipboard object will be added. It will be clicable 
        after exiting editable mode.`
      },          



    ]
  }

}
