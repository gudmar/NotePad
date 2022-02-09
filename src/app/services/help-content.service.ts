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
        This front end application is designed to store users' notes of different kind. The content is stored in the browser 
        local storage,
        so it will be remembered on the same browser and the same machine, if a new browser is opened, the data will be 
        unavailable. 
        <b>The data is not saved automatically, hit <i>ctrl+s</i> or go to <q>Manu->Save as</q> for saving the data</b>. 
        There is a save to the file and load from the
        file features if the data needs to be migrated to a different browser, however the data between browsers and machines 
        will not be synchronized,
        due to lack of server. <br>
        User can store notes in the notePad application, notes are divided into movable resizable note elements, 
        those elements are stored 
        on the page elements, and a set of page elements forms a sheet element. In this way notes can be gruped into 
        different categories/projects.</br>
        For organizing time dependent tasks there is a calendar component. A <b>Year view renders quite long.</b> 
        A calendar view consists of 
        months divided into calendar weeks, divided into days. Each day may have tasks bound to it. The number of tasks is 
        visible in the upper 
        corner of a day component. There is a week view. Years are created dynamically, so all years from 1000 to 
        3000 are supported. </br>
        The linker application is a sort of a personal browser. A user may add links to it, and save the whole application 
        state. Links will be
        remembered. In a linker there is a search box, so a user may type something and all links containing typed text in 
        their summary or 
        description will be filtered.</br>
        
        `
      },
      {
        title: 'Notepad',
        content:`An application that can be used to note some data in resizable, movable notes, 
        stored on pages inside sheets. 
        New sheets, pages and notes can be created. There is a shortcut ctrl+l for creating a link from a highlighted 
        note element text, and a ctrl+m shortcut for creating a copyable element from a notes of the highlighted text.`
      },
      {
        title: 'Calendar',
        content: `An application for managing tasks. They can be added, deleted, displayed, moved to another dates,
          viewed in a day, week or year view. The calendar is limited to display any year from 1000 to 3000.`
      },
      {
        title: 'Linker',
        content: `This component is designed for storing user's links. It can be activated from the upper tool-choice 
        navigation or from 
        Menu element in the left upper corner. In the right upper corner of the linker there is a plus button, 
        that opens a link addition window.
        A user inputs a link title (there is a lenght limitation), description, and a link itself. A <i>submit</i> button 
        will add a link to 
        the document object stored on the browser. <b>Beware. The link is not saved after clicking submit</b>. After refreshing 
        the browser it will be gone,
        so remember to hit ctrl+s to save the whole document object to the local storage.<br>
        A link object can be edited after it is added (click a "..." symbol in the upper right corner of a link element). 
        There is a serach box
        element, that will filter links based on the title and description fields.`
      },
      {
        title: 'Colors',
        content: `Colors of sheets or pages are calculated dynamically, they repete after some period, because they cannot
        be too live and must be readable. The Page color can be customized. Just go to Options menu in the top right 
        corner. The font color 
        is calculated based on color light. For darker colors font is white, for lighter backgrounds font will be black. 
        This behavior cannot be changed.`
      },
      {
        title: 'Sheet',
        content: `A component containing pages, can be switched in the notepad app with the menu on the left. 
        Sheets can be added with a button at the bottom of the sheet menu, and deleted with a cross on the right of a 
        sheet name. Double clicking on a sheet tab
        (left menu) will activate the sheet name change state. Names are length limited. A color of sheets cannot be 
        changed.`
      },
      {
        title: 'Page',
        content: `A component containing movable and resizable note components. Notes can be added in the page element. 
        A page name can be 
        altered after double clicking on the page tab (upper menu). If there are too many pages, tabs will collapse into
        an additional tab.
        The current pages tab has a bolded name. Pages can be added (add [+] tab in the upper menu or the Options menu), 
        deleted (x symbol of the Options menu). A page color can be changed in the right upper Options menu.`
      },
      {
        title: 'Note',
        content: `A movable and resizable child element of the page. It can be added in the edit mode 
        (Options-> edit mode or ctrl+e). Add a single note
        element by clicking on an empty page area while in edit mode. Focus the note element by clicking it. Delete the 
        note element by clicking [x] a button in the right upper corner of the note element while the note is focused. 
        Highlighted text shortcuts: ctrl+d for deletion, ctrl+l for
        creating a clickable link out of a selected text, ctrl+m to create a copyable element from a highlighted text. 
        Those shortcuts will work
        only when the edit mode is activated. Links will be opened only if the edit mode is disactivated. 
        After clicking a copyable element in notes
        while in non edit mode, the content of this element will be copied to the clipboard`
      },
      {
        title: 'Calendar year view',
        content: `A view, where a user sees the whole year is divided to months, calendar weeks and days. 
        Each day having tasks has a label with the number of tasks`
      },
      {
        title: 'Week view',
        content: `In the calendar view, a user has a preview of the whole week with summaries of tasks scheaduled for 
        each day. To activate this view just click on a calendar week number.
        By clicking a day a user can get to the day task edit view to modify or move tasks. Hovering over a task in a 
        week view displayes task details. Weeks can be switched in a week view with the upper 
        menu arrows. It takes no time to switch between weeks, even if they do not belong to the same year, as a year 
        view does not have to be rendered.`
      },
      {
        title: 'Day view',
        content: `Here a user can add, remove, modify and move tasks to other days. Task details are visible here. 
        Click on a day in the calendar to open this view.`
      },
      {
        title: 'Load window',
        content: `From here a user may load a document saved as a key in a browser local storage. 
        Documents can be removed from here. To open the menu and click <i>Load from key</i>`
      },
      {
        title: 'Document',
        content: `JS object, or string representation of such an object, with an application state. 
        Every note, page, sheet, link,
        task added by a user, every description, every note movement and resizement are saved to a runtime document. 
        This runtime document will be lost after the browser is refreshed, so remember to ctrl+s or 
        <i>save as</i> to remember the runtime document in the browser local storage.`
      },
      {
        title: 'Adding notes',
        content: `Options menu, chose <i>Edit mode</i> or hit ctrl+e to activate an edit mode and later click on a page 
        area, not occupated by another note object`
      },
      {
        title: 'Removing notes',
        content: `Click <i>X</i> button in the right upper notes corner`
      },
      {
        title: 'Selecting notes',
        content: `Click the area, where a note is located to focus it`
      },

      {
        title: 'Moving notes',
        content: `Drag and move a circle with four arrows in the upper notes part`
      },
      {
        title: 'Resizing notes',
        content: `Click on a note to focus it and resize it with a green dot in the right bottom corner of the dashed 
        frame. When the content 
        is too large to fit into the note component it will increase its height automatically. If the note leaves the 
        page component because of its large content, the page component will adjust its size.`
      },
      {
        title:'Resizing page',
        content:`
        The page is resized automatically when its content does not fit.`
      },
      {
        title: 'Adding pages',
        content: `Click <i>+</i> tab in the upper part of the application to add a page at the end. 
        To squeeze a page between existing pages
        select a predecessor, select Options menu in the right upper corner and click + symbol.`
      },
      {
        title: 'Removing pages',
        content: `Click <i>X</i> symbol in the right part of the page tab. If there exist any notes on the page 
        the confirmation message box will be displayed. An active page may also be deleted from the Options menu in the
         right upper corner of a page by selecting <i>X</i> symbol.`
      },
      {
        title: 'Selecting page',
        content: `Click on a tab with the page name in the upper part of the application`
      }, 
      {
        title: 'Renaming page',
        content: `Double click on the page tab and print a new name. A page name length is limited, it cannot be pasted, 
        the enter usage is blocked.`
      },      
      {
        title: 'Adding sheet with a single page',
        content: `Click an <i>Add +</i> button in the left menu to add a sheet at the end. 
        Squeezing sheets between existing ones is not supported`
      }, 
      {
        title: 'Removing sheet',
        content: `Click <i>X</i> symbol on the left part of the sheet tab. If some notes exist there, 
        or there are more pages than a single one, added by default, the confiramtion box will be displayed to 
        ensure a the delete button was not clicked fby accident.`
      }, 
      {
        title: 'Renaming sheet',
        content: `Double click the sheet tab (left side of application). A sheet name length is limited, it cannot be 
        pasted, the enter usage is blocked.`
      }, 
      {
        title: 'Saving document content to the local storage',
        content: `The menu (upper left corner), save, or <i>Ctrl+s</i>. Animation should aknowledge that the data was 
        saved. A name of the key under which a document will be saved is length limited.`
      }, 
      {
        title: 'Saving current document to a file',
        content: `Menu (upper left corner) -> save file. 
        A dialogue window will be shown and a default name of a file will be proposed. A name of a file is length limited.`
      }, 
      {
        title: 'Uploading file as current document / load from file',
        content: `A valid file should be dragged and dropped onto a page component area or on a calendar area. 
        Uploading files can also be done from <i>menu -> Load from file</i>. Then the file is loaded.`
      },                         
      {
        title: 'File validation',
        content: `Files that are to be loaded by the application are validated. Not valid files cannot be uploaded. 
        However files saved within this application are valid.`
      },      
      {
        title: 'Loading from local storage',
        content: `The menu (upper left corner) -> load button. Name of the data key should be chosen by a user, 
        and the operation should be confirmed with the <i>Load</i> button`
      },
      {
        title: 'Deleting a key from the local storage',
        content: `From the menu in the upper left corner choose a load option. 
        When the menu is displayed choose the key and click Remove. Then close the load form.`
      },
      {
        title: 'Calendar - entering year view',
        content: `After launching the calendar (upper left menu and calendar button or upper navigation menu), 
        year view is displayed.
        In the upper bar year number can be changed. A year is calculated dynamically. Years from 1000 to 3000 are 
        available. 
        Buttons <i>>></i> and <i><<</i> are designed to switch to the next and previous year. <b>Rendering of a year 
        view takes some time</b> and 
        it is not visualized. Every switching between years will take some time.`
      },
      {
        title: 'Tasks in year view',
        content: `If there are any tasks added to a day in the year view, the number of tasks will be displayed in the red 
        circle in the right upper day corner. The more tasks are added for the day, the darker the day element background 
        is.`
      },
      {
        title: 'Calendar weeks',
        content: `Year view is displayed with calendar weeks and each month has days belonging to a calendar week, but not belonging to current month grayed.`
      },
      {
        title: 'Adding tasks to calendar',
        content: `Click a day in the calendar year view. If there are no tasks planned for that day, 
        click <i>+</i> symbol in the middle of the day window. In a case there are already tasks planned for the day, 
        click green <i>+</i> symbol in the right part of the task. A new task will be added before the clicked one.`
      },
      {
        title: 'Removing task from the calendar',
        content: `Click a day in the claendar year view. Click the red <i>-</i> button in the right part of the task row. 
        The task will be removed.`
      },                    
      {
        title: 'Moving task',
        content: `Click a day in a calendar year view. Click the <i>move</i> label in the right part of the task row. 
        A widow will pop out and there a new date might be chosen. The date of the event target is validated, so if there 
        is not such a day in a calendar, after focus out content of the window will go back to the last value.`
      },                    
      {
        title: 'Date validation',
        content: `A year field in a year view and date fields in <i>move event</i> window are validated. 
        If a not valid option is chosen, a field background will change to red, and after the field loses focus, 
        the last valid value will be inserted into the field.`
      },        
      {
        title: 'Summary field validation',
        content: `The summary field is length limited, due to the fact, that this is a summary. 
        All data should go to the description field.`
      },          
      {
        title: 'Add link to notes',
        content: `A note component in notes supports links. In edit mode press Ctrl + l to create link out of highlighted
        text. A link can be activated by a click in not editable mode. A link description may be modified in an editable mode,
        however the link itself cannot. Pasted link will be clickable in not editable mode, but hold Ctrl while clicking on it,
        or else a current tab will be redirected`
      },          
      {
        title: 'Adding copyable object, copy on click',
        content: `There can be added an onclick copy to a clipboard object to the notes component. Highlight a range in
        notes component and press Ctrl + m, and a new click-copy-to-clipboard object will be added. It will be clickable 
        after exiting an editable mode.`
      },          
      {
        title: 'Create a link out of highlighted text in notes',
        content: `Highlight some text in edit mode in notes element on a page and click ctrl+l to 
        create a link out of highlighted text.`
      },    
      {
        title: 'Delete highlighted text',
        content: `Highlight some text in edit mode in notes element on a page and click ctrl+d to delete it`
      },
      {
        title: 'Edit mode',
        content: `When in a notePad component on a page hits ctrl+e or goes to Options (right upper corner) and selects 
        Edit mode to enter it.
        In edit mode new notes can be added, the content of notes can be altered, links in notes element and copyable 
        elements can be altered in this mode.
        In this mode one cannot activate a link that is stored in the notes component. To use the link and copyable 
        elements stored in the notes element exit edit mode.`
      },
      {
        title: 'Non edit mode',
        content: `In this mode a user can take advantage of copyable and link elements from the note component. 
        In this mode a user cannot 
        edit the content of the notes component. However, notes components can be moved, resized or deleted from here.`
      },
      {
        title: 'Routing',
        content: `This is a pure front end application, however routes /notePad, /linker and /calendar work. 
        Thanks to this a user may use the browser history, and refreshing the browser will return the same component.`
      },
      {
        title: 'Component vs element',
        content: `In this instruction components and elements are used interchangeably without any reference to the 
        implementation.`
      },
      {
        title: 'Future work',
        content: `There is planned an implementation of a <i>to do</i> component for storing and tracing different 
        <i>to do</i> activities.`
      },

    ]
  }

}
