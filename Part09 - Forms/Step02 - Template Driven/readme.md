# Step 02 -  Template Driven

## Requests

Because Angular is a single page application and there are no requests to other pages, the forms have no `action` or `method` parameter: 

```angular2html
<form> 
    ...
</form>
```

---

## Registering Form Elements

A form element to be registered into Angular needs:

```angular2html
<input
  type="email"
  id="email"
  class="form-control"
  ngModel
  name="email">
```

`ngModel` to make it visible and the `name` to retrieve the values.

---

## Retrieving Forms

It is possible to connect the submit action to a component method using `ngSubmit`:

```angular2html
<form (ngSubmit)="onSubmit()">
    ...
</form>
```
```typescript
onSubmit(){
  console.log('submitted');
}
```

A wrong way to retrieve the form is to use a generic reference an pass it to the submit method:

```angular2html
<form (ngSubmit)="onSubmit(f)" #f>
    ...
</form>
```

This is wrong because an element of type `HTMLFormElement` is retrieved:

```typescript
onSubmit(form: HTMLFormElement) {
  console.log('submitted');
  console.log(form);
}
```

The correct way is to assign `ngForm` to the local reference:

```angular2html
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
    ...
</form>
```

In this way an element of type `NgForm` is retrieved:

```typescript
onSubmit(form: NgForm) {
  console.log('submitted');
  console.log(form);
}
```

`NgForm` exposes a lot of method to manage the forms and get their status.



