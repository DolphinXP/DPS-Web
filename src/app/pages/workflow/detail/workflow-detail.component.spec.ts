import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkflowDetailComponent} from './workflow-detail.component';

describe('DetailComponent', () => {
  let component: WorkflowDetailComponent;
  let fixture: ComponentFixture<WorkflowDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowDetailComponent]
    });
    fixture = TestBed.createComponent(WorkflowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
