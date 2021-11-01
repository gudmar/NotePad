import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpContentService {

  constructor() { }

  getHelpContent(){
    return [
      {
        title:'About',
        content: `
        This front end application is designed to store users notes of different kind. Content is stored in browser local storage,
        so it will be remembered on the same browser and the same machine, if new browser is oppened, data will be unavailable. 
        <b>data is not saved automaticly, hit <i>ctrl+s</i> or go to <q>Manu->Save</q> as for saving data</b>. There is a save to file and load from
        file features if data needs to be migrated to a different browser, however data between browsers and machines will not be synchrinized,
        due to lack of server. <br>
        User can storage notes in notePad application, notes are divided into movable resizable note elements, those elements are stored 
        on page elemetns, and set of page elements forms a sheet element. In this way notes can be grupped into different categories/projects.</br>
        For organizing time dependent tasks there is a calendar component. <b>Year view renders quite long.</b> Calendar view consists of 
        months divided into calendar weeks, divided into days. Each day may have tasks binded to it. Numer of tasks is visible in upper 
        corner of day component. There is a week view. Years are created dynamicly, so all years from 1000 to 3000 are supported. </br>
        Linker application is a sort of a personal browser. User may add links to it, and save whole application state. Links will be
        remembered. In linker there is a search box, so user may type something and all links containing typed text in their summary or 
        description will be filtered.</br>
        
        `
      },
      {
        title: 'Notepad',
        content:`Application that can be used to note some data in resizable, movable notes, stored on pages inside sheets. 
        New sheets, pages and notes can be created. There is a shortcut ctrl+l for creating a link from a highlited note element text, 
        and a ctrl+m shortcut for creating a copyable element from a notes highlighed text.`
      },
      {
        title: 'Calendar',
        content: `Aplication for managing tasks. They can be added, deleted, displayed, moved to another dates,
          viewed in day, week or year view. Calendar is limited to display any year from 1000 to 3000.`
      },
      {
        title: 'Linker',
        content: `This component is designed for storing user links. It can be activated from upper tool-chose navigation or form 
        Menu element in left upper corner. In right upper corner of linker there is a plus button, that opens a link addition window.
        User inputs a link title (there is a lenght limitation), description, and a link its self. Submit button will add link to 
        document object stored on browser. <b>Beware. Link is not sevad after clicking submit</b>. After refreshing browser it will be gone,
        so remember to hit ctrl+s to save whole document object to local storage.<br>
        Link object can be edited after it is added (click a "..." symbol in upper right corner of a link element). There is a serach box
        element, that will filter links based on title and description fields.`
      },
      {
        title: 'Colors',
        content: `Colors of sheets or pages are calculated dynamicly, they repete after some period, because they cannot
        be to live, must be readable. Page color can be customized. Just go to Options menu in right left corner. Font color 
        is calculated based on color light. For darker colors font is white, for lighter backgrounds font will be black. This 
        behavior cannot be changed.`
      },
      {
        title: 'Sheet',
        content: `Component containing pages, can be switched in notepad app with menu on the left. Sheets can be
        added with button at the bottom of sheet menu, and deleted with cross on the right of sheet name. Double click on a sheet tab
        (left menu) will activate sheet name change state. Names are lenght limited. Color of sheets cannot be changed.`
      },
      {
        title: 'Page',
        content: `Component containing movable and resizable note components. Notes can be added in page element. Page name can be 
        altered after double clicking on page tab (upper menu). If there are too many pages tabs will be collapsed into additional tab.
        Current pages tab has bolded name. Pages can be added (add [+] tab in upper menu or Options menu), deleted (x symbol of Options menu). Page 
        color can be changed in right upper Options menu.`
      },
      {
        title: 'Note',
        content: `A movable and resizable child element of page. Can be added in edit mode (Options-> edit mode or ctrl+e). Add single note
        element by clicking on empty page area while in edit mode. Focus note element by clicking it. Delete note element by clicking [x] 
        button int right upper corner of note element while note is focused. Highlited text shortcuts: ctrl+d for deletion, ctrl+l for
        creating a clicable link out of selected text, ctrl+m to create a copyable element from higlited text. Those shortcuts will work
        only when edit mode is activated. Links will be opened only if edit mode is disactivated. After clicking a copyable element in notes
        while in non edit mode, content of this element will be copied to clipboard`
      },
      {
        title: 'Calendar year view',
        content: `View, where user sees whole year divided to months, calendar weeks and days. Each day having task
        has a label with number of tasks`
      },
      {
        title: 'Week view',
        content: `Calendar view, where user has a preview of whole week with summaries of tasks scheaduled for each day. 
        To activate this view just click on a calendar week number.
        By clicking a day user can get to day task edit view to modify or move tasks. Hovering over a task in week view 
        displayes task details. Weeks can be switched in week view with upper 
        menu arrows. It takes no time to switch between weeks, even if they do not belong to the same year, as year view does not 
        have to be rendered.`
      },
      {
        title: 'Day view',
        content: `Here user can add, remove, modify and move tasks to other days. Task details are visible here. Click on a day in 
        calendar to open this view.`
      },
      {
        title: 'Load window',
        content: `From here user may load document saved as key in browser local storage. Documents can be removed from
        here. To open to to menu and click <i>Load from key</i>`
      },
      {
        title: 'Document',
        content: `JS object, or string representation of such object, with application state. Every note, page, sheet, link,
        task added by user, every description, every note movement and resizement are saved to a runtime document. This runtime 
        document will be losed after browser is refreshed, so remember to ctrl+s or <q>save as</q> to remember runtime document
        to browser local storage.`
      },
      {
        title: 'Adding notes',
        content: `Options menu, chose <i>Edit mode</i> or hit ctrl+e to activate edit mode and later click on page area, not occupated by other note object`
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
        title: 'Resizing notes',
        content: `Click on note to focus it and resize it with a green dot in right bottom corner of dashed frame. When content 
        is to large to fit into note component it will increase its height automaticly. If note leaves page component because of its
        large content, page component will adjust its size.`
      },
      {
        title:'Resizing page',
        content:`
        Page is resized automaticly when its content does not fit.`
      },
      {
        title: 'Adding pages',
        content: `Click <i>+</i> tab in upper part of application to add page at the end. To squeez a page between existing pages
        selec predecator, select Options menu in right upper corner and click + symbol.`
      },
      {
        title: 'Removing pages',
        content: `Click <i>X</i> symbol in right part of page tab. If there exist any notes on page 
        confirmation message box will be displayed. Active page may also be deleted from Options menu in right upper corner of page by
        selecting <i>X</i> symbol.`
      },
      {
        title: 'Selecting page',
        content: `Click on tab with page name in upper part of application`
      }, 
      {
        title: 'Renaming page',
        content: `Double click on page tab and print new name. Page name length is limited, it cannot be paseted, enter usage is blocked.`
      },      
      {
        title: 'Adding sheet with a single page',
        content: `Click a <q>Add +</q> button in left menu to add sheet at the end. Squeezing sheets between existing ones is not supprted`
      }, 
      {
        title: 'Removing sheet',
        content: `Click <i>X</i> symbol in left part of sheet tab. If there exist some notes, 
        or there are more pages than single one, added by default, confiramtion box will be displayed to 
        ensure user did not click delete button by accident.`
      }, 
      {
        title: 'Renaming sheet',
        content: `Double click sheet tab (left side of application). Sheet name length is limited, it cannot be pasted, enter usage is blocked.`
      }, 
      {
        title: 'Saving document content to local storage',
        content: `Menu (upper left corner), save, or <i>Ctrl+s</i>. Animation should aknowledge that data was saved.
          Name of key under which document will be saved is length limited.`
      }, 
      {
        title: 'Saving current document to a file',
        content: `Menu (upper left corner), save file. 
        Dialog window will be showed and default name of file will be proposed. Name of file is length limited.`
      }, 
      {
        title: 'Uploading file as current document / load from file',
        content: `Valid file should be dragged and dropped onto page component area or on calendar area. Uploading files can also be
        done from <i>menu -> Load from file</i>. Then file is loaded`
      },                         
      {
        title: 'File validation',
        content: `Files that are to be loaded by application are valideated. Not valid files cannot be uploaded. However files saved 
        within this aplication are valid.`
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
        content: `After launching calendar (upper left menu and calendar button or upper navigation menu), year view is displayed. 
        in upper bar year number can be changed. Year is calculated dynamicly. Years from 1000 to 3000 are available. 
        Buttons <i>>></i> and <i><<</i> are designed to switch to next and previous year. <b>Rendering of year view takes some time</b> and 
        it is not visualized. Every switching between years will take some time.`
      },
      {
        title: 'Tasks in year view',
        content: `If there are any tasks added to day in year view, number of tasks will be displayed in red circle in right upper day corner. 
        The more tasks are added for the day, the darker the day element background.`
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
        Widow will pop out and there new date might be chosen. Date of event target is validated, so if there is not such a day
        in clendar, after focus out content of window will go back to last value.`
      },                    
      {
        title: 'Date validation',
        content: `Year field in year view and date fields in move event to window are validated. 
        If not valid option is chosen, field background will change to red, and after field loses focus, 
        last valid value will be inserted into field.`
      },        
      {
        title: 'Summary field validation',
        content: `Summary field is length limited, due to fact, that this is a summary. All data should go to the description field.`
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
      {
        title: 'Create a link out of highlidet text in notes',
        content: `Highlight some text in edti mode in notes element on paga and click ctrl+l to create a link out of highlidet text.`
      },    
      {
        title: 'Delete highlited text',
        content: `Highlight some text in edti mode in notes element on paga and click ctrl+d to delete it`
      },
      {
        title: 'Edit mode',
        content: `When in notePad component on page hit ctrl+e or go to Options (right upper corner) and select Edit mode to enter it.
        In edit mode new notes can be added, content of notes can be altered, links in notes element and copyable elements can be altered in this mode.
        In this mode one cannot activate a link that is stored in notes component. To use link and copyable elemets stored in notes element 
        exit edit mode.`
      },
      {
        title: 'Non edit mode',
        content: `In this mode user can take advantage of copyable and link elements from note component. In this mode user cannot 
        edit content of  notes component. However notes components can be moved, resized or deleted from here.`
      },
      {
        title: 'Routing',
        content: `This is a pure front end application, however routes /notePad, /linker and /calendar work. Thanks to this user 
        may use browser history, and refreshing browser will return the same component.`
      },
      {
        title: 'Component vs element',
        content: `In this instruction component and element are used interchangebly without any reference to implementation.`
      },
      {
        title: 'Future work',
        content: `There is planned implementatnio of a <q>to do</q> component for storing and tracting different todo activities.`
      },

    ]
  }

}
