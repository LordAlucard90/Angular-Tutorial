# Step 03 - Assignment 01

## Exercise

1. Create two new Components (manually or with CLI): WarningAlert and SuccessAlert
2. Output them beneath each other in the AppComponent
3. Output a warning or success message in the Components
4. Style the Components appropriately (maybe some red/ green text?)

Use external or internal templates and styles!

Feel free to create more components, nest them into each other or play around with different types of selectors!

---

## Solution

I used two components created with the CLI.

Each component has:
- A **message** variable with the text to displayed.
- A html file with a span with the **{{ message }}** and a bootstrap class for manage the colors.

In the **app.component.html** there are two separate div-col with the alerts tag.

---

## Issues

Angular does not crate a new project with a number or a underscore in the name.

```bash
$ ng new assignment-01    // does not work
$ ng new assignment_01    // does not work
$ ng new assignment-one   // works
```