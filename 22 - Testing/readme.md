# Testing

## Content

- [Spec Files](#spec-files)
- [TestBed](#testbed)
- [Assertion](#assertion)
- [Running Tests](#running-tests)
- [Testing Service Injection](#testing-service-injection)
- [Testing Template Content](#testing-template-content)
- [Async](#async)
- [Isolated Tests](#isolated-tests)
- [Documentation](#documentation)

---

## Spec Files

The tests are collected in units:

```typescript
describe('AppComponent', () => {...});

```

A test is composed by the title and the relative code:

```typescript
it('test title', () => {...});
```

Each test is independent from the other tests, it is possible to run some code before each test:

```typescript
beforeEach(async(() => {...}));
```

## TestBed

`TestBed` is the main Angular testing utility object.

- **configureTestingModule** - declares the components that will be used in the unit.
- **createComponent** - create the component required in the test.

The **createComponent** method returns an object commonly stored in a variable called `fixture`.

This object has some useful methods like:

- **debugElement** - contains some useful properties and method like:
    - **componentInstance** - the component instance.
    - **nativeElement** - the component template.
    - **injector** - the component injector, used to inject services into the component.
- **componentInstance** - the component instance (same as **debugElement.componentInstance**)
- **detectChanges** - triggers the changes to render the template.
- **whenStable** - is like `detectChanges` but for asynchronous tasks.

## Assertion

The assertion are verified with the `expect` function.

This function receives the actual value `expect(actual_value)` and, to verify the assertion, is called a method from the result:

```typescript
expect(actual_value).assertSomething(expected_value);
```
Some assertion examples are_
- `toBeTruthy()` - the object must exists.
- `toEqual(expected_value)` - **expected_value** and **actual_value** must be equal.
- `toContain(expected_value)` - **actual_value** must contain the **expected_value**.

## Running Tests

The CLI command is:

```bash
ng test
```

The command compiles and runs the tests, the result can be viewed in the command line or in the browser at http://localhost:9876

## Testing Service Injection

A good practice when a service like:

```typescript
export class UserService {
  user = {
    name: 'Ciccio'
  };
}
```

is injected in a component like:

```typescript
import { Component, OnInit } from '@angular/core';
import {UserService} from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  user: { name: string } = { name: '' };
  isLoggedIn = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
  }

}
```

during testing is to use the stub data, not the actual data:

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    const userServiceStub = {
      user: { name: 'Test User'}
    };

    TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      providers:    [ {provide: UserService, useValue: userServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {...});

  it('should use the user name from the service', () => {
    expect(userService.user.name).toEqual(component.user.name);
  });

});
```

The service must be provided with the stub data used in the test:

```typescript
providers:    [ {provide: UserService, useValue: userServiceStub } ]
```

The service in the test is retrieved from the `dubugElement`:

```typescript
userService = fixture.debugElement.injector.get(UserService);
```

## Testing Template Content

It is possible to test template content like:

```angular2html
<div *ngIf="isLoggedIn">
  <h1>User logged in.</h1>
  <p>User is: {{user.name}}</p>
</div>
<div *ngIf="!isLoggedIn">
  <h1>User not logged in.</h1>
  <p>Please log in first.</p>
</div>
```
In this way:

```typescript
it('should not display the user name if the user is not logged in', () => {
    const native = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(native.querySelector('p').textContent).not.toContain(component.user.name);
});

it('should display the user name if the user is logged in', () => {
    const native = fixture.debugElement.nativeElement;
    component.isLoggedIn = true;
    fixture.detectChanges();
    expect(native.querySelector('p').textContent).toContain(component.user.name);
});
```

## Async

It is possible to simulate asynchronous tasks like:

```typescript
export class DataService {
  getDetails(){
    const resultPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Data');
      }, 1500);
    });
    return resultPromise;
  }
}
```

#### Real Async

When a promise is returned `detectChanges` is not enough to detect the changes

```typescript
it('should not fetch data without the async', () => {
    spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'));
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
});

it('should fetch data with the async', async (() => {
    spyOn(dataService, 'getDetails').and.returnValue(Promise.resolve('Data'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.data).toBe('Data');
    });
}));
```
`whenStable` can be used to detect the asynchronous changes.

`spyOn` is used to simulate methods.


#### Fake Async

In order to reduce the promise test execution time it is possible to use `fakeAsync` and `tick`:

```typescript
it('should fetch data with the fakeAsync', fakeAsync(() => {
    const spy = spyOn(dataService, 'getDetails')
      .and.returnValue(Promise.resolve('Test Data'));
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('Test Data');
}));
```

**Warning** - in this case do not put `fixture.detectChanges()` in the `beforeEach`:

```typescript
beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    dataService = fixture.debugElement.injector.get(DataService);
    // fixture.detectChanges();
});
```

## Isolated Tests

Not all tests need to use the Angular test framework. For example a Pipe:

```typescript
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform{
  transform(value: string, ...args): any {
    return value.split('').reverse().join('');
  }
}
```

Does not need `TestBed` or `async`:

```typescript
import {ReversePipe} from './reverse.pipe';

describe('ReversePipe', () => {
  it('should reverse text', () => {
    const reversePipe = new ReversePipe();
    expect(reversePipe.transform('hello')).toEqual('olleh');
  });
});
```

## Documentation

- https://angular.io/guide/testing
- https://github.com/angular/angular-cli/wiki/test
- https://github.com/angular/angular-cli/wiki/e2e

