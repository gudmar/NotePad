Under developement at the moment.

## What is this applicatoin for?
This is frond end application developed in Angular. Its main purpose is to learn Angular TDD approach. It will have workbooks, and each workbook will have pages. User will ba able to add workbooks and pages, and notes to pages. After hitting a save button, all notepad content will be added to localStorage. There will be possiblity to export notes to a text file, and import notes fron exported file. There is also a callendar with option of adding notes for each day to it.


## Requirements for each component:

Hierarchy of components:
App -> Workbook -> Page -> Note -> text
                                -> table
                 -> Add new Page
    -> Calendar -> Page -> Note -> text
                                -> table
    -> AddNewWorkbook
    
Each of components can have a menu with options like changing a color, changing title etc.

Services for: 
  1) Creating a JSON from NotePad content (tree design pattern);
  2) Createig NotePad content from JSON (Also tree used, each component will have a service extracting own content, rest of content will be passed to children)
  3) Comunication between parent and its children. Command to collect own content and content of children will be passed with this service
  4) Saving content into file
  5) Loading content from external file;
  6) Chosing a color for page. Colors will be hardcoded, as it is easier to chose a decent color than if colors are generated automaticly
  7) Copy selected text
  
#### Note:
States: Editable, notEditable, Idle, Delete
R1: If Note is clicked, it gets into Editable state.
R1.1: Frame surrounding note is displayed,
R1.2: Menu is displayed (with options to delete note, add table, copyt text)
R1.3: Content in Editable state is editable
R2: After mouse click to area outside note element, Note component leaves Editable state.
R3: Delete state is passed from parent component. After click on note thats parent is in this  state, it is deleted.
R4: Idle state is inhereted from parent. After clicknig note in this state, nothing happens. Only selecting text for copy purposes is allowed in this state.

#### Page:
States: AddNewNotes, DeleteNotes, Idle,
R1: After clicking page in place outside a Note component, in AddNoeNotes state, there is a new note inserted, new note is in Editable state,
R2: After clicking page in Delete Notes state, if cursor is outside any notes component, nothing happens,
R3: After clicknig page on notes element, in DeleteNotes state, clicked note is deleted
R4: New Page component is added to applicatoin in Idle state. In this state only selecting text and copying it is allowed.
R5: There is a menu displayed on page comopnent. This menu has options for changing Page components state

#### Workbook:
States: editPageTitleState, deletePagesState, idleState ??
R1: There is a bar with page titles. After clicking a page selection button, there is jump to this page, it is displayed with all current notes.
R2: There is an add new page button available on right of page selection buttons. After clicking this button, new page is added, button for selecting this page is added, focus goes to new page selection button, and this button is in edit state,
R3: When workbook is in deletePagesState, after selecting page chose button, button and related page are deleted
R4: After selecting title, when this component is in editTitleState, page selection button enters edit state, and content can be edited,