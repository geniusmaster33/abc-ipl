import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPredictionsComponent } from './recent-predictions.component';

describe('RecentPredictionsComponent', () => {
  let component: RecentPredictionsComponent;
  let fixture: ComponentFixture<RecentPredictionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentPredictionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
