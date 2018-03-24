import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPredictComponent } from './match-predict.component';

describe('MatchPredictComponent', () => {
  let component: MatchPredictComponent;
  let fixture: ComponentFixture<MatchPredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchPredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
