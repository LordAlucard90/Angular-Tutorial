# Assignments

## Content

**The Basics**:
- [Assignment 01](#assignment-01)
- [Assignment 02](#assignment-02)
- [Assignment 03](#assignment-03)

## Assignment 01

### Exercise

1. Create two new Components (manually or with CLI): WarningAlert and SuccessAlert
2. Output them beneath each other in the AppComponent
3. Output a warning or success message in the Components
4. Style the Components appropriately (maybe some red/ green text?)

Use external or internal templates and styles!

Feel free to create more components, nest them into each other or play around with different types of selectors!

### Solution

I used two components created with the CLI.

Each component has:
- A **message** variable with the text to displayed.
- A html file with a span with the **{{ message }}**
and a bootstrap class for manage the colors.

In the **app.component.html** there are two separate div-col with the alerts tag.

### Issues

Angular does not crate a new project with a number or a underscore in the name.

```bash
ng new assignment-01    // does not work
ng new assignment_01    // does not work
ng new assignment-one   // works
```

New version of Angular (13.3.5) allows it:
```bash
ng new assignment-01
```

## Assignment 02

### Exercise

1. Add a Input field which updates a property ('username') via Two-Way-Binding
2. Output the username property via String Interpolation (in a paragraph below the input)
3. Add a button which may only be clicked if the username is NOT an empty string
4. Upon clicking the button, the username should be reset to an empty string

### Solution

I used `ngModel` to link the username variable to the `input`
field and a String Interpolation to display the value into a paragraph.

To active the reset button I used a Property Binding:
`[disabled]="!isUsernameEmpty()"` 
who checked le username length.

To reset the `username` I used a Event Binding: `(click)="resetUsername()"`.

## Assignment 03

### Exercise

1. Add A button which says 'Display Details'
2. Add a paragraph with any content of your choice (e.g. 'Secret Password = tuna')
3. Toggle the displaying of that paragraph with the button created in the first step
4. Log all button clicks in an array and output that array below the secret paragraph (maybe log a timestamp or simply an incrementing number)
5. Starting at the 5th log item, give all future log items a blue background (via ngStyle) and white color (ngClass)

### Solution

I used an `Event Binding` on the button for the click event with a function who changed the value of the boolean field associated to the visibility of the paragraph.

The paragraph visibility was managed by an `*ngIf`.

For the event logging I have associated a paragraph:
- `*ngFor` associated to a list of clicks.
- `ngStyle` associated to the text color.
- `ngClass` associated to the background color.

### Improvement

It is possible extract the index of the current element
and use it with this syntax:

```angular2html
<p *ngFor="let click of clickLogs; let i = index"
  [ngClass]="{'high-log': i > 4}"
  [ngStyle]="{color: i > 4 ? 'white' : ''}"
>{{click}}</p>
```

