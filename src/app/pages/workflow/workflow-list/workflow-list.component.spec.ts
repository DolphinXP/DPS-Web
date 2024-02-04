import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowListComponent } from './workflow-list.component';

describe('WorkflowListComponent', () => {
  let component: WorkflowListComponent;
  let fixture: ComponentFixture<WorkflowListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowListComponent]
    });
    fixture = TestBed.createComponent(WorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
