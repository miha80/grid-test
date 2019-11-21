import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveGridComponent } from './responsive-grid.component';

describe('ResponsiveGridComponent', () => {
  let component: ResponsiveGridComponent;
  let fixture: ComponentFixture<ResponsiveGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
