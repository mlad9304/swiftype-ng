import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedresultComponent } from './savedresult.component';

describe('SavedresultComponent', () => {
  let component: SavedresultComponent;
  let fixture: ComponentFixture<SavedresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
