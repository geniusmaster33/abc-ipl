import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchUtilComponent } from './match-util.component';

describe('MatchUtilComponent', () => {
  let component: MatchUtilComponent;
  let fixture: ComponentFixture<MatchUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
