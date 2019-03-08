import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RanktableComponent } from './ranktable.component';

describe('RanktableComponent', () => {
  let component: RanktableComponent;
  let fixture: ComponentFixture<RanktableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RanktableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RanktableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
