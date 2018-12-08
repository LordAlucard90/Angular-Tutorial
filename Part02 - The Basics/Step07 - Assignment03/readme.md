# Step 07 - Assignment 03

## Exercise

1. Add A button which says 'Display Details'
2. Add a paragraph with any content of your choice (e.g. 'Secret Password = tuna')
3. Toggle the displaying of that paragraph with the button created in the first step
4. Log all button clicks in an array and output that array below the secret paragraph (maybe log a timestamp or simply an incrementing number)
5. Starting at the 5th log item, give all future log items a blue background (via ngStyle) and white color (ngClass)

---

## Solution

I used an `Event Binding` on the button for the click event with a function who changed the value of the boolean field associated to the visibility of the paragraph.

The paragraph visibility was managed by an `*ngIf`.

For the event logging I have associated a paragraph:
- `*ngFor` associated to a list of clicks.
- `ngStyle` associated to the text color.
- `ngClass` associated to the background color.

