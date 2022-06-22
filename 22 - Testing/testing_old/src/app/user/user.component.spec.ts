import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UserComponent } from './user.component';
import {UserService} from './user.service';
import {DataService} from '../shared/data.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;
  let dataService: DataService;

  beforeEach(async(() => {
    const userServiceStub = {
      user: { name: 'Test User'}
    };
    const dataServiceStub = {
      data: 'Test Data'
    };

    TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      providers:    [
        {provide: UserService, useValue: userServiceStub },
        {provide: DataService, useValue: dataServiceStub }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    dataService = fixture.debugElement.injector.get(DataService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture.debugElement.componentInstance).toEqual(component);
  });

  it('should use the user name from the service', () => {
    fixture.detectChanges();
    expect(userService.user.name).toEqual(component.user.name);
  });

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

  it('should fetch data with the fakeAsync', fakeAsync(() => {
    const spy = spyOn(dataService, 'getDetails')
      .and.returnValue(Promise.resolve('Test Data'));
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('Test Data');
  }));

});
