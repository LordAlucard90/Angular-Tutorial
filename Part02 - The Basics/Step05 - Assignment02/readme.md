## Step 05 - Assignment 02

## Exercise

1. Add a Input field which updates a property ('username') via Two-Way-Binding
2. Output the username property via String Interpolation (in a paragraph below the input)
3. Add a button which may only be clicked if the username is NOT an empty string
4. Upon clicking the button, the username should be reset to an empty string

---

## Solution

I used `ngModel` to link the username variable to the `input` field and a String Interpolation to display the value into a paragraph.

To active the reset button I used a Property Binding: `[disabled]="!isUsernameEmpty()"` who checked le username length.

To reset the `username` I used a Event Binding: `(click)="resetUsername()"`.


