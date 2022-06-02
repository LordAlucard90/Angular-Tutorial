# Dynamic Components

## Content

- [ngIf](#ngIf)
- [Programmatically Construction](#programmatically-construction)

---

## ngIf

The easiest way to create dynamic components, as the auth error alert is 
the ngIf:
```angular2html
<!-- auth.component.html -->
<!-- ... -->
<app-alert 
    [message]="error"
    *ngIf="!!error"
    (close)="onHandleError()"
    ></app-alert>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class AuthComponent implements OnInit {
    // ...

    onHandleError() {
        this.error = undefined;
    }
}
```
where the alert component is:
```angular2html
<!-- alert.component.html -->
<div class="backdrop" (click)="onClose()"></div>
<div class="alert-box">
    <p>{{ message }}</p>
    <div class="alert-box-actions">
        <button class="btn btn-primary" (click)="onClose()">Close</button>
    </div>
</div>
```
```typescript
@Component({
    // ...
})
export class AlertComponent implements OnInit {
    @Input() message: string | undefined;
    @Output() close = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void { }

    onClose() {
        this.close.emit();
    }
}
```

## Programmatically Construction

[Programmatically construction documenttion](https://angular.io/guide/dynamic-component-loader)

To create a component programmatically, it is necessary to create and register
a custom directive that allows to access the DOM using angular:
```typescript
@Directive({
    selector: '[appPlaceholder]',
})
export class PlaceholderDirective {
    constructor(public viewContainerRef: ViewContainerRef){}
}
```
```typescript
@NgModule({
    declarations: [
        // ...
        PlaceholderDirective,
    ],
    // ...
})
export class AppModule { }
```
the directive can be added to a template in the html:
```angular2html
<!-- auth.component.html -->
<ng-template appPlaceholder></ng-template>
<!-- ... -->
```
it is used an `ng-template` in order to do no introduce overhead of loaded elements
in the application.


Now it is possible to create a component programmatically in this way:
```typescript
@Component({
    // ...
})
export class AuthComponent implements OnInit, OnDestroy {
    // ...
    @ViewChild(PlaceholderDirective) alertPlaceholder: PlaceholderDirective | undefined;
    private closeSubscription: Subscription | undefined;

    constructor(
        // ...
        private componentFactoryResolver: ComponentFactoryResolver,
    ) { }
        
    // ...

    onSubmit(form: NgForm) {
        // ...
        authObservable.subscribe(
            response => {
                // ...
            },
            errorMessage => {
                // ...
                this.showErrorMessage(errorMessage);
            },
        );
        // ...
    }

    // ...

    private showErrorMessage(error: string) {
        if (this.alertPlaceholder) {
            const alertComponentFactory =
                this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

            const alertViewContainerRef = this.alertPlaceholder.viewContainerRef;
            // clear previous data
            alertViewContainerRef.clear();

            // componenet creation
            const componentRef = alertViewContainerRef.createComponent(alertComponentFactory);

            // data and event binding
            componentRef.instance.message = error;
            this.closeSubscription = componentRef.instance.close.subscribe(() => {
                if (this.closeSubscription) {
                    this.closeSubscription.unsubscribe();
                }
                alertViewContainerRef.clear();
            });
        }
    }

    ngOnDestroy(): void {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }
}
```
with Angular up to 8 it is also necesasty to register the dynamic component
in the entryComponents too:
```typescript
@NgModule({
    // ...
    entryComponents: [AlertComponent],
})
export class AppModule { }
```

