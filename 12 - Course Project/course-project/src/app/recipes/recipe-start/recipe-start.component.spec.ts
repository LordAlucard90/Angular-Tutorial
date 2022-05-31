import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStartComponent } from './recipe-start.component';

describe('RecipeStartComponent', () => {
  let component: RecipeStartComponent;
  let fixture: ComponentFixture<RecipeStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
